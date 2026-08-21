from __future__ import annotations

import copy
import json
from pathlib import Path
import unittest

from public_demo import build_demo
from research_audit import audit_payload


class ResearchAuditTests(unittest.TestCase):
    def setUp(self) -> None:
        sample_path = Path(__file__).resolve().parents[1] / "sample_input.fake.json"
        self.payload = json.loads(sample_path.read_text(encoding="utf-8"))

    def test_valid_frozen_test_run_passes(self) -> None:
        result = audit_payload(self.payload)
        self.assertEqual("passed", result["status"])
        self.assertEqual([], result["findings"])

    def test_future_availability_is_blocked(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["records"][0]["available_on"] = "2030-01-05"
        result = audit_payload(payload)
        self.assertIn(
            "not_available_as_of_run:synthetic_market_factor",
            result["findings"],
        )

    def test_mechanical_target_leakage_is_blocked(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["records"][0]["mechanically_contains_target"] = True
        result = audit_payload(payload)
        self.assertIn(
            "mechanical_target_leakage:synthetic_market_factor",
            result["findings"],
        )

    def test_test_retuning_is_blocked(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["model"]["retune_requested"] = True
        result = audit_payload(payload)
        self.assertIn("test_retune_blocked", result["findings"])

    def test_unfrozen_test_configuration_is_blocked(self) -> None:
        payload = copy.deepcopy(self.payload)
        payload["model"]["frozen_config"] = False
        result = audit_payload(payload)
        self.assertIn("test_config_not_frozen", result["findings"])

    def test_missing_record_field_fails_closed(self) -> None:
        payload = copy.deepcopy(self.payload)
        del payload["records"][0]["available_on"]
        result = audit_payload(payload)
        self.assertIn(
            "missing_available_on:synthetic_market_factor",
            result["findings"],
        )

    def test_demo_is_deterministic_and_offline(self) -> None:
        first = build_demo()
        second = build_demo()
        self.assertEqual(first, second)
        self.assertFalse(first["controls"]["network_enabled"])
        self.assertFalse(first["controls"]["real_market_data_loaded"])
        self.assertFalse(first["controls"]["model_fitting_enabled"])


if __name__ == "__main__":
    unittest.main()
