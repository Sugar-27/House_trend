package middleware

import (
	"log/slog"
	"net/http"
)

// Recover converts unexpected panics into JSON 500 responses.
func Recover(logger *slog.Logger) Middleware {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			defer func() {
				if recovered := recover(); recovered != nil {
					logger.Error("panic recovered", "request_id", RequestIDFromContext(req.Context()), "error", recovered)
					writeError(w, http.StatusInternalServerError, "internal_error", "unexpected server error")
				}
			}()

			next.ServeHTTP(w, req)
		})
	}
}
