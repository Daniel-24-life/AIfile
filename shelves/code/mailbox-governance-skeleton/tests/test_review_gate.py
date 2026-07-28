from __future__ import annotations

import unittest

from mailbox_review.review_gate import MailAction, review_action


class ReviewGateTests(unittest.TestCase):
    def test_local_draft_is_ready(self) -> None:
        decision = review_action(
            MailAction("act_demo_1", "draft_reply", "not_required")
        )
        self.assertEqual("ready", decision.state)

    def test_pending_send_needs_review(self) -> None:
        decision = review_action(
            MailAction("act_demo_2", "send_reply", "pending")
        )
        self.assertEqual("needs_review", decision.state)
        self.assertIn("external_action_requires_approval", decision.reason_codes)

    def test_approved_send_is_ready(self) -> None:
        decision = review_action(
            MailAction(
                "act_demo_3",
                "send_reply",
                "approved",
                approval_ref="approval_demo_1",
            )
        )
        self.assertEqual("ready", decision.state)

    def test_approved_send_without_reference_needs_review(self) -> None:
        decision = review_action(
            MailAction("act_demo_4", "send_reply", "approved")
        )
        self.assertEqual("needs_review", decision.state)
        self.assertIn("missing_approval_reference", decision.reason_codes)

    def test_duplicate_action_is_blocked(self) -> None:
        decision = review_action(
            MailAction(
                "act_demo_5",
                "move_message",
                "approved",
                approval_ref="approval_demo_2",
                duplicate=True,
            )
        )
        self.assertEqual("blocked", decision.state)
        self.assertIn("duplicate_action", decision.reason_codes)

    def test_raw_content_is_blocked(self) -> None:
        decision = review_action(
            MailAction(
                "act_demo_6",
                "classify",
                "not_required",
                contains_raw_content=True,
            )
        )
        self.assertEqual("blocked", decision.state)
        self.assertIn("raw_content_not_allowed", decision.reason_codes)

    def test_unknown_action_is_blocked(self) -> None:
        decision = review_action(
            MailAction("act_demo_7", "unknown", "not_required")
        )
        self.assertEqual("blocked", decision.state)
        self.assertIn("unknown_action_type", decision.reason_codes)


if __name__ == "__main__":
    unittest.main()
