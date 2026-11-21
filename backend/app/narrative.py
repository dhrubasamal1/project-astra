"""Narrative generation engine with deterministic templates and guarded LLM verification.

Features:
- Deterministic executive narrative generation detailing rankings, top-3 pillar drivers, and risks.
- Disqualification explanations for hard dealbreakers.
- Tie-check sensitivity warning (< 5.0 points difference).
- Guarded LLM wrapper with strict numeric hallucination detector:
  Validates every generated number against ground-truth facts. If hallucinated numbers
  are detected or LLM is unavailable, falls back safely to deterministic template text.
"""

import re
from typing import Any, Callable, Dict, List, Optional, Set, Tuple
from backend.app.models import SiteComparisonRank, SiteScorecard


def extract_numbers_from_text(text: str, ignored_years: Optional[Set[int]] = None) -> List[float]:
    """Extract numeric values from text while ignoring standard years/versions."""
    if ignored_years is None:
        ignored_years = {2023, 2024, 2025, 2026, 2030, 2035, 2040, 2050}

    # Match integers and decimals (e.g. 15.2, 50, 0.75, 1,000)
    # Handle commas in numbers
    cleaned_text = re.sub(r'(\d+),(\d+)', r'\1\2', text)
    pattern = r'(?<![A-Za-z0-9_])[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?(?![A-Za-z0-9_])'

    numbers = []
    for match in re.finditer(pattern, cleaned_text):
        token = match.group(0).strip()
        if not token or token == ".":
            continue
        try:
            val = float(token)
            # Ignore standard calendar years
            if int(val) in ignored_years and abs(val - int(val)) < 1e-4:
                continue
            numbers.append(val)
        except ValueError:
            pass
    return numbers


def build_ground_truth_numbers(
    rankings: List[SiteComparisonRank],
    scorecards: List[SiteScorecard],
    extra_facts: Optional[Dict[str, Any]] = None
) -> Set[float]:
    """Collect all valid numeric values from scorecards and rankings."""
    truth_numbers: Set[float] = set()

    for r in rankings:
        truth_numbers.add(round(r.overall_score, 1))
        truth_numbers.add(round(r.overall_score, 2))
        truth_numbers.add(float(r.rank))
        for val in r.pillar_scores.values():
            truth_numbers.add(round(val, 1))
            truth_numbers.add(round(val, 2))

    for sc in scorecards:
        truth_numbers.add(round(sc.overall_score, 1))
        truth_numbers.add(round(sc.area_km2, 1))
        truth_numbers.add(round(sc.area_ha, 1))
        truth_numbers.add(round(sc.site_confidence_pct, 1))

        for p in sc.pillars.values():
            truth_numbers.add(round(p.weight, 1))
            truth_numbers.add(round(p.raw_score, 1))
            truth_numbers.add(round(p.weighted_score, 1))

        for ind in sc.indicators.values():
            if ind.value is not None:
                try:
                    num_val = float(ind.value)
                    truth_numbers.add(round(num_val, 1))
                    truth_numbers.add(round(num_val, 2))
                    if 0.0 <= num_val <= 1.0:
                        truth_numbers.add(round(num_val * 100.0, 1))
                except (ValueError, TypeError):
                    pass
            if ind.score is not None:
                truth_numbers.add(round(ind.score, 1))

    if extra_facts:
        for v in extra_facts.values():
            if isinstance(v, (int, float)):
                truth_numbers.add(round(float(v), 1))
                truth_numbers.add(round(float(v), 2))

    return truth_numbers


def verify_numeric_hallucinations(
    generated_text: str,
    truth_numbers: Set[float],
    tolerance_pct: float = 2.0,
    abs_tolerance: float = 0.5
) -> Tuple[bool, List[float]]:
    """Verify that every number mentioned in generated_text matches a ground-truth number."""
    extracted = extract_numbers_from_text(generated_text)
    hallucinated: List[float] = []

    for num in extracted:
        # Check if num is close to any number in truth_numbers
        matched = False
        for truth in truth_numbers:
            # Absolute difference
            diff = abs(num - truth)
            if diff <= abs_tolerance:
                matched = True
                break
            # Relative percentage difference
            if abs(truth) > 0.001 and (diff / abs(truth) * 100.0) <= tolerance_pct:
                matched = True
                break

        if not matched:
            hallucinated.append(num)

    is_clean = (len(hallucinated) == 0)
    return is_clean, hallucinated


def generate_comparison_narrative(
    rankings: List[SiteComparisonRank],
    scorecards: List[SiteScorecard],
    preset: str = "balanced",
    tie_note: Optional[str] = None
) -> str:
    """Generate deterministic, executive-grade comparison narrative."""
    if not rankings:
        return "No candidate sites were evaluated for comparison."

    preset_name = preset.replace("_", "-").title()
    qualified = [r for r in rankings if not r.is_disqualified]
    disqualified = [r for r in rankings if r.is_disqualified]

    paragraphs: List[str] = []

    # Title & Lead paragraph
    paragraphs.append(
        f"### Executive Site Selection Summary (Weight Preset: {preset_name})\n"
        f"A total of {len(rankings)} candidate urban development sites were evaluated across "
        f"the 5 Multi-Criteria Analysis pillars: Terrain & Land, Water Security, Hazard Risk, "
        f"Environmental Impact, and Infrastructure Access."
    )

    # Winner / Top Rank
    if qualified:
        winner = qualified[0]
        top_drivers_str = ", ".join(winner.top_drivers) if winner.top_drivers else "balanced multi-pillar performance"
        paragraphs.append(
            f"**Rank #1: {winner.site_name}** emerges as the leading candidate with an overall suitability score of "
            f"**{winner.overall_score:.1f}/100** ({winner.verdict}). The primary competitive advantages driving this "
            f"recommendation are superior performance in **{top_drivers_str}**."
        )

        # Runner-up comparison if present
        if len(qualified) > 1:
            runner_up = qualified[1]
            diff = winner.overall_score - runner_up.overall_score
            paragraphs.append(
                f"**Rank #2: {runner_up.site_name}** achieved an overall score of **{runner_up.overall_score:.1f}/100**, "
                f"trailing by {diff:.1f} points. While demonstrating strength in {', '.join(runner_up.top_drivers[:2])}, "
                f"it faces trade-offs in {', '.join(runner_up.key_risks[:2])} relative to the primary choice."
            )

        if len(qualified) > 2:
            third = qualified[2]
            paragraphs.append(
                f"**Rank #3: {third.site_name}** scored **{third.overall_score:.1f}/100** ({third.verdict}), "
                f"constrained predominantly by {', '.join(third.key_risks[:2])}."
            )
    else:
        paragraphs.append(
            "**All evaluated candidate sites were disqualified** due to triggering one or more hard environmental or "
            "hazard deal-breaker thresholds. No site is currently recommended for urban development."
        )

    # Disqualification section
    if disqualified:
        disq_items = []
        for d in disqualified:
            disq_items.append(f"- **{d.site_name}** (Score: {d.overall_score:.1f}): Disqualified due to {', '.join(d.key_risks)}.")
        paragraphs.append(
            "#### Disqualified Sites (Hard Deal-Breaker Violations)\n" + "\n".join(disq_items)
        )

    # Tie check advisory note
    if tie_note:
        paragraphs.append(f"> **Advisory Notice**: {tie_note}")

    # Conclusion & Ground Validation
    paragraphs.append(
        "**Strategic Recommendation**: Multi-criteria scores represent regional satellite and geospatial screening. "
        "Ground geotechnical borings, groundwater pump tests, and local municipal right-of-way surveys should precede "
        "binding statutory land acquisition."
    )

    return "\n\n".join(paragraphs)


def generate_guarded_narrative(
    rankings: List[SiteComparisonRank],
    scorecards: List[SiteScorecard],
    preset: str = "balanced",
    tie_note: Optional[str] = None,
    llm_callable: Optional[Callable[[str], str]] = None,
    prompt: Optional[str] = None,
    extra_facts: Optional[Dict[str, Any]] = None
) -> Tuple[str, bool, List[float]]:
    """Generate narrative using guarded LLM with automatic fallback to deterministic template.

    Returns:
        (narrative_text, used_llm, hallucinated_numbers)
    """
    deterministic_text = generate_comparison_narrative(rankings, scorecards, preset, tie_note)

    if llm_callable is None:
        return deterministic_text, False, []

    truth_numbers = build_ground_truth_numbers(rankings, scorecards, extra_facts)

    try:
        call_prompt = prompt or f"Summarize candidate site rankings:\n{deterministic_text}"
        raw_llm_response = llm_callable(call_prompt)

        is_clean, hallucinated = verify_numeric_hallucinations(raw_llm_response, truth_numbers)

        if is_clean:
            return raw_llm_response, True, []
        else:
            # Hallucinated numbers detected: safely fall back!
            return deterministic_text, False, hallucinated

    except Exception:
        # LLM failure/timeout/error: safely fall back!
        return deterministic_text, False, []
