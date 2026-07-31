from __future__ import annotations

from collections.abc import Collection, Mapping
from dataclasses import asdict, dataclass

from .review_gate import EXTERNAL_ACTIONS, MailAction, review_action


ACCOUNT_STATES = {"healthy", "cautious", "read_only", "paused"}


@dataclass(frozen=True)
class AccountSnapshot:
    account_alias: str
    state: str


@dataclass(frozen=True)
class MorningProposal:
    message_ref: str
    account_alias: str
    action: MailAction


@dataclass(frozen=True)
class MorningDecision:
    action_id: str
    message_ref: str
    account_alias: str
    action_type: str
    account_state: str
    policy_state: str
    execution_state: str
    reason_codes: tuple[str, ...]


def review_morning_proposal(
    proposal: MorningProposal,
    accounts: Mapping[str, AccountSnapshot],
    recorded_action_ids: Collection[str] = (),
) -> MorningDecision:
    if not proposal.message_ref.strip():
        return _decision(
            proposal,
            account_state="unknown",
            policy_state="blocked",
            execution_state="blocked",
            reason_codes=("missing_message_ref",),
        )

    account = accounts.get(proposal.account_alias)
    if account is None:
        return _decision(
            proposal,
            account_state="unknown",
            policy_state="blocked",
            execution_state="blocked",
            reason_codes=("unknown_account_alias",),
        )
    if account.state not in ACCOUNT_STATES:
        return _decision(
            proposal,
            account_state=account.state,
            policy_state="blocked",
            execution_state="blocked",
            reason_codes=("unknown_account_state",),
        )

    action_decision = review_action(proposal.action, recorded_action_ids)
    if action_decision.state == "blocked":
        return _decision(
            proposal,
            account.state,
            "blocked",
            "blocked",
            action_decision.reason_codes,
        )
    if action_decision.state == "needs_review":
        return _decision(
            proposal,
            account.state,
            "needs_review",
            "review_queue",
            action_decision.reason_codes,
        )

    if proposal.action.action_type in EXTERNAL_ACTIONS:
        if account.state in {"read_only", "paused"}:
            return _decision(
                proposal,
                account.state,
                "blocked",
                "blocked",
                (f"account_{account.state}",),
            )
        if account.state == "cautious":
            return _decision(
                proposal,
                account.state,
                "needs_review",
                "review_queue",
                ("account_cautious",),
            )
        return _decision(
            proposal,
            account.state,
            "allowed",
            "mock_queue_only",
            (),
        )

    return _decision(
        proposal,
        account.state,
        "allowed",
        "local_artifact_only",
        (),
    )


def build_demo_run() -> dict[str, object]:
    accounts = {
        item.account_alias: item
        for item in (
            AccountSnapshot("acct_demo_green", "healthy"),
            AccountSnapshot("acct_demo_amber", "cautious"),
            AccountSnapshot("acct_demo_blue", "read_only"),
            AccountSnapshot("acct_demo_gray", "paused"),
        )
    }
    proposals = (
        MorningProposal(
            "msg_demo_401",
            "acct_demo_blue",
            MailAction("act_demo_401", "classify", "not_required"),
        ),
        MorningProposal(
            "msg_demo_402",
            "acct_demo_amber",
            MailAction("act_demo_402", "draft_reply", "not_required"),
        ),
        MorningProposal(
            "msg_demo_403",
            "acct_demo_green",
            MailAction(
                "act_demo_403",
                "send_reply",
                "approved",
                approval_ref="approval_demo_403",
            ),
        ),
        MorningProposal(
            "msg_demo_404",
            "acct_demo_amber",
            MailAction(
                "act_demo_404",
                "send_reply",
                "approved",
                approval_ref="approval_demo_404",
            ),
        ),
        MorningProposal(
            "msg_demo_405",
            "acct_demo_blue",
            MailAction(
                "act_demo_405",
                "send_reply",
                "approved",
                approval_ref="approval_demo_405",
            ),
        ),
        MorningProposal(
            "msg_demo_406",
            "acct_demo_green",
            MailAction(
                "act_demo_406",
                "move_message",
                "approved",
                approval_ref="approval_demo_406",
            ),
        ),
        MorningProposal(
            "msg_demo_407",
            "acct_demo_gray",
            MailAction(
                "act_demo_407",
                "send_reply",
                "approved",
                approval_ref="approval_demo_407",
            ),
        ),
    )
    decisions = [
        review_morning_proposal(
            proposal,
            accounts,
            recorded_action_ids={"act_demo_406"},
        )
        for proposal in proposals
    ]
    states = {state: 0 for state in ("allowed", "needs_review", "blocked")}
    for decision in decisions:
        states[decision.policy_state] += 1

    return {
        "sample": True,
        "run_id": "mailbox_morning_demo_001",
        "controls": {
            "network_enabled": False,
            "credentials_loaded": False,
            "real_messages_read": 0,
            "real_messages_sent": 0,
        },
        "account_snapshots": [asdict(account) for account in accounts.values()],
        "summary": {
            "proposals": len(decisions),
            **states,
        },
        "decisions": [asdict(decision) for decision in decisions],
    }


def _decision(
    proposal: MorningProposal,
    account_state: str,
    policy_state: str,
    execution_state: str,
    reason_codes: tuple[str, ...],
) -> MorningDecision:
    return MorningDecision(
        action_id=proposal.action.action_id,
        message_ref=proposal.message_ref,
        account_alias=proposal.account_alias,
        action_type=proposal.action.action_type,
        account_state=account_state,
        policy_state=policy_state,
        execution_state=execution_state,
        reason_codes=reason_codes,
    )
