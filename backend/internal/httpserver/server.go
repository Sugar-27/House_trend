package httpserver

import (
	"log/slog"
	"net/http"
	"time"

	"github.com/Sugar-27/House_trend/backend/internal/config"
	"github.com/Sugar-27/House_trend/backend/internal/middleware"
)

// RouteRegistry defines the handler methods needed by the HTTP server layer.
type RouteRegistry interface {
	Health(http.ResponseWriter, *http.Request)
	MarketSummary(http.ResponseWriter, *http.Request)
	LatestRates(http.ResponseWriter, *http.Request)
}

// New wires routes and middleware into an HTTP server instance.
func New(cfg config.Config, logger *slog.Logger, handlers RouteRegistry) *http.Server {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", handlers.Health)
	mux.HandleFunc("GET /api/v1/market/summary", handlers.MarketSummary)
	mux.HandleFunc("GET /api/v1/rates/latest", handlers.LatestRates)

	chain := middleware.Chain(
		middleware.RequestID,
		middleware.Recover(logger),
		middleware.Logger(logger),
		middleware.CORS(cfg.AllowedOrigins),
		middleware.RateLimit(cfg.RateLimitRequests, cfg.RateLimitWindow, middleware.ClientIP),
	)

	return &http.Server{
		Addr:              cfg.Address(),
		Handler:           chain(mux),
		ReadHeaderTimeout: cfg.ReadHeaderTimeout,
		IdleTimeout:       60 * time.Second,
	}
}
