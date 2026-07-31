from __future__ import annotations

import json
from pathlib import Path
import unittest

from mailbox_review.morning_run import (
    AccountSnapshot,
    MorningProposal,
    build_demo_run,
    review_morning_proposal,
)
from mailbox_review.review_gate import MailAction


class MorningRunTests(unittest.TestCase):
    def setUp(self) -> None:
        self.accounts = {
            "healthy": AccountSnapshot("healthy", "healthy"),
            "cautious": AccountSnapshot("cautious", "cautious"),
            "read_only": AccountSnapshot("read_only", "read_only"),
            "paused": AccountSnapshot("paused", "paused"),
        }

    def proposal(self, alias: str, action: MailAction) -> MorningProposal:
        return MorningProposal("msg_demo_test", alias, action)

    def approved_send(self, action_id: str = "act_demo_test") -> MailAction:
        return MailAction(
            action_id,
            "send_reply",
            "approved",
            approval_ref="approval_demo_test",
        )

    def test_demo_has_no_network_or_credentials(self) -> None:
        controls = build_demo_run()["controls"]
        self.assertFalse(controls["network_enabled"])
        self.assertFalse(controls["credentials_loaded"])
        self.assertEqual(0, controls["real_messages_read"])
        self.assertEqual(0, controls["real_messages_sent"])

    def test_demo_summary_matches_decisions(self) -> None:
        payload = build_demo_run()
        self.assertEqual(7, payload["summary"]["proposals"])
        self.assertEqual(3, payload["summary"]["allowed"])
        self.assertEqual(1, payload["summary"]["needs_review"])
        self.assertEqual(3, payload["summary"]["blocked"])

    def test_captured_artifact_matches_demo(self) -> None:
        repository_root = Path(__file__).resolve().parents[4]
        artifact_path = (
            repository_root
            / "showcases"
            / "mailbox-agent-system"
            / "morning-run.fake.json"
        )
        captured = json.loads(artifact_path.read_text(encoding="utf-8"))
        generated = json.loads(json.dumps(build_demo_run()))
        self.assertEqual(generated, captured)

    def test_healthy_external_action_reaches_mock_queue_only(self) -> None:
        decision = review_morning_proposal(
            self.proposal("healthy", self.approved_send()),
            self.accounts,
        )
        self.assertEqual("allowed", decision.policy_state)
        self.assertEqual("mock_queue_only", decision.execution_state)

    def test_cautious_external_action_needs_review(self) -> None:
        decision = review_morning_proposal(
            self.proposal("cautious", self.approved_send()),
            self.accounts,
        )
        self.assertEqual("needs_review", decision.policy_state)
        self.assertIn("account_cautious", decision.reason_codes)

    def test_read_only_external_action_is_blocked(self) -> None:
        decision = review_morning_proposal(
            self.proposal("read_only", self.approved_send()),
            self.accounts,
        )
        self.assertEqual("blocked", decision.policy_state)
        self.assertIn("account_read_only", decision.reason_codes)

    def test_paused_external_action_is_blocked(self) -> None:
        decision = review_morning_proposal(
            self.proposal("paused", self.approved_send()),
            self.accounts,
        )
        self.assertEqual("blocked", decision.policy_state)
        self.assertIn("account_paused", decision.reason_codes)

    def test_local_action_remains_local_on_read_only_account(self) -> None:
        decision = review_morning_proposal(
            self.proposal(
                "read_only",
                MailAction("act_local", "classify", "not_required"),
            ),
            self.accounts,
        )
        self.assertEqual("allowed", decision.policy_state)
        self.assertEqual("local_artifact_only", decision.execution_state)

    def test_unknown_account_alias_is_blocked(self) -> None:
        decision = review_morning_proposal(
            self.proposal("missing", self.approved_send()),
            self.accounts,
        )
        self.assertEqual("blocked", decision.policy_state)
        self.assertIn("unknown_account_alias", decision.reason_codes)

    def test_missing_message_reference_is_blocked(self) -> None:
        proposal = MorningProposal("", "healthy", self.approved_send())
        decision = review_morning_proposal(proposal, self.accounts)
        self.assertEqual("blocked", decision.policy_state)
        self.assertIn("missing_message_ref", decision.reason_codes)

    def test_unknown_account_state_is_blocked(self) -> None:
        accounts = {"bad": AccountSnapshot("bad", "undefined")}
        decision = review_morning_proposal(
            self.proposal("bad", self.approved_send()),
            accounts,
        )
        self.assertEqual("blocked", decision.policy_state)
        self.assertIn("unknown_account_state", decision.reason_codes)

    def test_duplicate_action_is_blocked_before_account_release(self) -> None:
        action = self.approved_send("act_duplicate")
        decision = review_morning_proposal(
            self.proposal("healthy", action),
            self.accounts,
            recorded_action_ids={"act_duplicate"},
        )
        self.assertEqual("blocked", decision.policy_state)
        self.assertIn("duplicate_action", decision.reason_codes)


if __name__ == "__main__":
    unittest.main()
