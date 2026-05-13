package middleware

import (
	"net"
	"net/http"
	"strings"
	"sync"
	"time"
)

type visitor struct {
	windowStart time.Time
	requests    int
}

// RateLimit provides a small in-memory per-client limiter for the service skeleton.
func RateLimit(maxRequests int, window time.Duration, keyFunc func(*http.Request) string) Middleware {
	var mutex sync.Mutex
	visitors := make(map[string]visitor)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			now := time.Now()
			key := keyFunc(req)

			mutex.Lock()
			entry := visitors[key]
			if entry.windowStart.IsZero() || now.Sub(entry.windowStart) >= window {
				entry = visitor{windowStart: now, requests: 0}
			}

			entry.requests++
			visitors[key] = entry
			limited := entry.requests > maxRequests
			mutex.Unlock()

			if limited {
				writeError(w, http.StatusTooManyRequests, "rate_limited", "too many requests, please retry later")
				return
			}

			next.ServeHTTP(w, req)
		})
	}
}

// ClientIP extracts the best-effort client IP for public API throttling.
func ClientIP(req *http.Request) string {
	forwardedFor := req.Header.Get("X-Forwarded-For")
	if forwardedFor != "" {
		parts := strings.Split(forwardedFor, ",")
		if ip := strings.TrimSpace(parts[0]); ip != "" {
			return ip
		}
	}

	realIP := strings.TrimSpace(req.Header.Get("X-Real-Ip"))
	if realIP != "" {
		return realIP
	}

	host, _, err := net.SplitHostPort(req.RemoteAddr)
	if err == nil && host != "" {
		return host
	}

	return req.RemoteAddr
}
