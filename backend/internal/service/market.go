package service

import (
	"context"
	"strings"
	"time"

	"github.com/Sugar-27/House_trend/backend/internal/model"
)

// MarketService provides market aggregation data for handlers.
type MarketService struct{}

// NewMarketService creates the market service skeleton.
func NewMarketService() *MarketService {
	return &MarketService{}
}

// GetSummary returns a deterministic placeholder summary until MySQL-backed aggregation is added.
func (s *MarketService) GetSummary(ctx context.Context, filter model.MarketFilter) (model.MarketSummary, error) {
	select {
	case <-ctx.Done():
		return model.MarketSummary{}, ctx.Err()
	default:
	}

	normalized := normalizeFilter(filter)
	factor := float64(len([]rune(normalized.City))+len([]rune(normalized.District))+len([]rune(normalized.HouseType))) / 10
	if factor < 1 {
		factor = 1
	}

	transactionCount := int(1180 * factor)
	averagePrice := int(64200 * factor)
	transactionArea := transactionCount * 91
	transactionAmount := float64(averagePrice*transactionArea) / 100000000

	return model.MarketSummary{
		Filter:             normalized,
		AveragePrice:       averagePrice,
		TransactionCount:   transactionCount,
		TransactionArea:    transactionArea,
		TransactionAmount:  round(transactionAmount, 2),
		GeneratedAt:        time.Now().UTC(),
		DataFreshnessLabel: "mock-backend-skeleton",
	}, nil
}

func normalizeFilter(filter model.MarketFilter) model.MarketFilter {
	filter.City = defaultString(filter.City, "上海")
	filter.District = defaultString(filter.District, "全市")
	filter.HouseType = defaultString(filter.HouseType, "二手房")
	filter.Range = defaultString(filter.Range, "90d")

	return filter
}

func defaultString(value string, fallback string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return fallback
	}

	return trimmed
}

func round(value float64, precision int) float64 {
	multiplier := 1.0
	for range precision {
		multiplier *= 10
	}

	return float64(int(value*multiplier+0.5)) / multiplier
}
