# syntax=docker/dockerfile:1
FROM golang:1.25.7-alpine AS builder

WORKDIR /go/src/service

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server ./cmd

FROM alpine:latest

WORKDIR /go/src/service

RUN apk add --no-cache ca-certificates

COPY --from=builder /go/src/service/server .

CMD ["./server"]