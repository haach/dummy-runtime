# dummy-runtime

A small todo app for trying [Aiven Runtime](https://aiven.io/docs/products/runtime/deploy-apps).

Aiven detects `Dockerfile` at the repository root. The image listens on port **8080** (`EXPOSE 8080`).

```bash
npm install
npm run dev
```

Production image:

```bash
docker build -t dummy-runtime .
docker run --rm -p 8080:8080 dummy-runtime
```
