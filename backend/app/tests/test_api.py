from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    r = client.get('/health')
    assert r.status_code == 200
    assert r.json()['status'] == 'ok'


def test_predict():
    r = client.post('/api/v1/predict', json={'corridorId': 'corridor-a', 'lookaheadMonths': 3})
    assert r.status_code == 200
    body = r.json()
    assert body['modelVersion']
    assert len(body['predictions']) >= 1
