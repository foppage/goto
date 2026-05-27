FROM node:lts-alpine AS site-builder
WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm ci
COPY ./frontend/ .
RUN npm run build

FROM golang:alpine AS backend-builder
RUN apk add --no-cache gcc musl-dev
ENV CGO_ENABLED=1
WORKDIR /app
COPY ./backend/go.* .
RUN go mod download
COPY ./backend .
RUN go build -o main ./cmd/main.go

FROM alpine
WORKDIR /app
COPY --from=site-builder /app/dist ./dist
COPY --from=backend-builder /app/main .
RUN mkdir "db"
EXPOSE 8080
CMD ["./main"]