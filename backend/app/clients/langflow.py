import httpx
from fastapi import HTTPException


class LangflowClient:
    def __init__(self, base_url: str, api_key: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key

    async def run_flow(self, flow_id: str, inputs: dict) -> dict:
        url = f"{self.base_url}/api/v1/run/{flow_id}"
        payload = {
            "input_value": inputs.get("input_value", ""),
            "input_type": "chat",
            "output_type": "chat",
            "tweaks": inputs.get("tweaks", {}),
        }
        headers: dict[str, str] = {}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=headers, timeout=30.0)
                response.raise_for_status()
                return response.json()
        except httpx.ConnectError as exc:
            raise HTTPException(status_code=502, detail=f"Could not connect to Langflow: {exc}") from exc
        except httpx.HTTPStatusError as exc:
            raise HTTPException(
                status_code=502,
                detail=f"Langflow returned {exc.response.status_code}: {exc.response.text}",
            ) from exc
