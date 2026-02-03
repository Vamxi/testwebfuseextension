import os

import requests

SERVER_NAME = os.environ["SERVER_NAME"]
SPACE_ID = os.environ["SPACE_ID"]
EXTENSION_ID = os.environ["EXTENSION_ID"]
REST_KEY = os.environ["REST_KEY"]
STORAGE_APP = os.environ["STORAGE_APP"]
REPO_URL = os.environ["REPO_URL"]
REF = os.environ.get("REF", "main")


def update_extension_from_github() -> dict:
    """Update extension by pulling latest code from GitHub."""
    url = f"https://{SERVER_NAME}/api/spaces/{SPACE_ID}/extensions/{EXTENSION_ID}/github/"
    headers = {"Authorization": f"Token {REST_KEY}"}
    data = {
        "name": os.environ.get("EXTENSION_NAME", "My Extension"),
        "repo_url": REPO_URL,
        "ref": REF,
        "storage_app": int(STORAGE_APP),
    }

    response = requests.put(url, headers=headers, json=data, timeout=60)
    response.raise_for_status()
    return response.json()


def get_active_session_ids() -> list[str]:
    """Fetch all active session IDs for the space."""
    url = f"https://{SERVER_NAME}/api/spaces/{SPACE_ID}/sessions/"
    headers = {"Authorization": f"Token {REST_KEY}"}
    session_ids: list[str] = []

    while url:
        response = requests.get(url, headers=headers, timeout=30)
        response.raise_for_status()
        payload = response.json()
        session_ids.extend(
            session["session_id"]
            for session in payload.get("results", [])
            if session.get("duration") is None
        )
        url = payload.get("next")

    return session_ids


def refresh_extension(session_id: str) -> None:
    """Refresh extension in a specific session."""
    url = (
        f"https://{SERVER_NAME}/api/spaces/{SPACE_ID}/sessions/"
        f"{session_id}/refresh-extension/{EXTENSION_ID}/"
    )
    headers = {"Authorization": f"Token {REST_KEY}"}
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()


def main() -> None:
    print(f"Updating extension from {REPO_URL} (ref: {REF})...")
    extension = update_extension_from_github()
    print(f"Extension updated: {extension.get('name')}")

    session_ids = get_active_session_ids()
    print(f"Found {len(session_ids)} active session(s)")

    for session_id in session_ids:
        try:
            refresh_extension(session_id)
            print(f"Refreshed session {session_id}")
        except requests.RequestException as exc:
            print(f"Failed to refresh session {session_id}: {exc}")

    print("Deployment complete!")


if __name__ == "__main__":
    main()