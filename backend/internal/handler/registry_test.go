package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Sugar-27/House_trend/backend/internal/config"
	"github.com/Sugar-27/House_trend/backend/internal/model"
	"github.com/Sugar-27/House_trend/backend/internal/service"
)

type responseEnvelope struct {
	Data json.RawMessage `json:"data"`
}

func TestHealthHandler(t *testing.T) {
	registry := NewRegistry(config.Config{Environment: "test"}, service.NewMarketService(), service.NewRateService())
	request := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	response := httptest.NewRecorder()

	registry.Health(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	var envelope responseEnvelope
	if err := json.NewDecoder(response.Body).Decode(&envelope); err != nil {
		t.Fatalf("decode envelope: %v", err)
	}

	var health model.HealthStatus
	if err := json.Unmarshal(envelope.Data, &health); err != nil {
		t.Fatalf("decode health: %v", err)
	}
	if health.Status != "ok" || health.Service != "house-trend-backend" || health.Environment != "test" {
		t.Fatalf("unexpected health response: %#v", health)
	}
}

func TestMarketSummaryHandler(t *testing.T) {
	registry := NewRegistry(config.Config{Environment: "test"}, service.NewMarketService(), service.NewRateService())
	request := httptest.NewRequest(http.MethodGet, "/api/v1/market/summary?city=上海&district=浦东新区&houseType=二手房&range=90d", nil)
	response := httptest.NewRecorder()

	registry.MarketSummary(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", response.Code)
	}

	var envelope responseEnvelope
	if err := json.NewDecoder(response.Body).Decode(&envelope); err != nil {
		t.Fatalf("decode envelope: %v", err)
	}

	var summary model.MarketSummary
	if err := json.Unmarshal(envelope.Data, &summary); err != nil {
		t.Fatalf("decode market summary: %v", err)
	}
	if summary.Filter.District != "浦东新区" || summary.Filter.HouseType != "二手房" {
		t.Fatalf("unexpected market summary filter: %#v", summary.Filter)
	}
}
