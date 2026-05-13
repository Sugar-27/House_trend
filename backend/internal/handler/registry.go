package handler

import (
	"net/http"
	"time"

	"github.com/Sugar-27/House_trend/backend/internal/config"
	"github.com/Sugar-27/House_trend/backend/internal/httpserver"
	"github.com/Sugar-27/House_trend/backend/internal/model"
	"github.com/Sugar-27/House_trend/backend/internal/service"
)

// Registry holds HTTP handlers and their service dependencies.
type Registry struct {
	cfg           config.Config
	marketService *service.MarketService
	rateService   *service.RateService
}

// NewRegistry creates a handler registry.
func NewRegistry(cfg config.Config, marketService *service.MarketService, rateService *service.RateService) *Registry {
	return &Registry{cfg: cfg, marketService: marketService, rateService: rateService}
}

// Health returns service liveness metadata.
func (r *Registry) Health(w http.ResponseWriter, req *http.Request) {
	httpserver.WriteJSON(w, http.StatusOK, model.HealthStatus{
		Status:      "ok",
		Service:     "house-trend-backend",
		Environment: r.cfg.Environment,
		CheckedAt:   time.Now().UTC(),
	})
}

// MarketSummary returns the current market aggregation placeholder.
func (r *Registry) MarketSummary(w http.ResponseWriter, req *http.Request) {
	query := req.URL.Query()
	summary, err := r.marketService.GetSummary(req.Context(), model.MarketFilter{
		City:      query.Get("city"),
		District:  query.Get("district"),
		HouseType: query.Get("houseType"),
		Range:     query.Get("range"),
	})
	if err != nil {
		httpserver.WriteError(w, http.StatusRequestTimeout, "request_cancelled", "request was cancelled before market summary was generated")
		return
	}

	httpserver.WriteJSON(w, http.StatusOK, summary)
}

// LatestRates returns the latest financing indicator placeholder.
func (r *Registry) LatestRates(w http.ResponseWriter, req *http.Request) {
	snapshot, err := r.rateService.GetLatest(req.Context(), req.URL.Query().Get("city"))
	if err != nil {
		httpserver.WriteError(w, http.StatusRequestTimeout, "request_cancelled", "request was cancelled before rate snapshot was generated")
		return
	}

	httpserver.WriteJSON(w, http.StatusOK, snapshot)
}
