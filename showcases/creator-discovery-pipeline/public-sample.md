# Public Sample

The sample below is fake. It shows field shape and review logic only.

| creator_id | source_type | profile_fit_status | activity_status | contact_status | review_state | risk_note |
| --- | --- | --- | --- | --- | --- | --- |
| fake_creator_001 | seed_network | likely_fit | recent_activity | public_email_visible | approved | none |
| fake_creator_002 | search_result | possible_fit | activity_unclear | contact_unknown | review_needed | activity evidence is thin |
| fake_creator_003 | external_reference | poor_fit | recent_activity | public_contact_page | excluded | segment mismatch |
| fake_creator_004 | seed_network | likely_fit | unknown | dm_visible | review_needed | activity needs manual check |

## Field Notes

| Field | Meaning |
| --- | --- |
| `creator_id` | Fake stable identifier for public samples. |
| `source_type` | General source category. |
| `profile_fit_status` | Review label for target fit. |
| `activity_status` | Whether recent activity is visible enough for review. |
| `contact_status` | Whether a public contact route is visible, absent, or unknown. |
| `review_state` | Handoff state after review gates. |
| `risk_note` | Short explanation of missing evidence or exclusion reason. |

The real project used richer workbooks and private review notes. Those materials stay outside this repository.
