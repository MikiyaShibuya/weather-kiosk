FROM tiangolo/uvicorn-gunicorn-fastapi:python3.10 AS base

ENV TZ=Asia/Tokyo

COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

COPY ./app /app

# ==== Develop ====
FROM base AS dev

CMD uvicorn main:app --port $PORT --host 0.0.0.0 --reload

# ==== Release ====
FROM base AS release

CMD uvicorn main:app --port $PORT --host 0.0.0.0
