# Doctor Dashboard — Video consultation (Agora)

## Scope

**Completed in this repository:** Doctor Dashboard video-call integration only.

The **patient application lives in a separate repository** and is not part of this workspace. Patient-side integration using the same backend API flow must be implemented there when that repo is available.

Files such as `PatientVideoCallWeb.jsx`, `TestVideoPage.jsx`, and the `/patvideocall/...` route in `App.js` are **reference / legacy prototypes** in this repo. They are not considered part of the shipped Doctor Dashboard integration.

## Doctor routes

| Route | Component | Auth |
|-------|-----------|------|
| `/doctor/videocall/:consultationId` | `DoctorVideoCall.jsx` | Doctor session (`accessToken` in sessionStorage) |
| Appointment detail (embedded) | `DoctorVideoCall` in `AppointmentDetails.jsx` | Same |

Example (local):

```
http://localhost:3000/doctor/videocall/{appointment-uuid}
```

Set `REACT_APP_API_BASE` to your backend URL (e.g. ngrok or local Django).

## Backend API flow (Doctor Dashboard)

All endpoints: `/doctors/appointments/{appointmentId}/call/...`

| Step | API | Doctor Dashboard behavior |
|------|-----|---------------------------|
| Open screen | `GET .../status/` | Load call state; show Start / Join / ended summary |
| Start / Join | `POST .../start/` if `not_started` | Treat `already_started` as success |
| Agora credentials | `POST .../token/` | Cached until near `expires_at`; refresh on join failure |
| Channel join success | `POST .../events/` `{ "event_type": "joined" }` | Retry with exponential backoff on network/5xx |
| During call | Agora SDK only | `user-published` / `user-left` for UI; no backend presence APIs |
| End call | `POST .../end/` then `leaveChannel()` | Do **not** send `left` event |
| Resume / reconnect | `GET .../status/` | If `ended`, leave channel; if `in_progress` and `presence_sync.should_report_joined`, re-send `joined` |

Shared API client: `src/services/appointmentCallService.js`

Primary UI: `DoctorVideoCall.jsx` (+ `VideoHeader`, `VideoControls`, `VideoPip`, `WaitingScreen`).

## Patient app (separate repo — not implemented here)

When implementing the patient app, reuse the same backend contract and mirror the flow above. Differences for the patient client:

- Auth token from the patient app session (or deep-link token), not the doctor dashboard session.
- Same five endpoints under `/doctors/appointments/{id}/call/`.
- Patient may call `POST .../start/` when `call_status` is `not_started` (backend allows either party to start).
- Do not send `left` after a successful `POST .../end/`.

`appointmentCallService.js` in this repo can be copied or extracted as a shared package for the patient project.
