package service

import (
	"context"
	"time"

	"github.com/Sugar-27/House_trend/backend/internal/model"
)

// RateService provides financing indicators for the rates page.
type RateService struct{}

// NewRateService creates the rate service skeleton.
func NewRateService() *RateService {
	return &RateService{}
}

// GetLatest returns a placeholder rate snapshot until the real rate source is connected.
func (s *RateService) GetLatest(ctx context.Context, city string) (model.RateSnapshot, error) {
	select {
	case <-ctx.Done():
		return model.RateSnapshot{}, ctx.Err()
	default:
	}

	return model.RateSnapshot{
		City:               defaultString(city, "上海"),
		CommercialLoanRate: 3.45,
		FundLoanRate:       2.85,
		DownPaymentRatio:   0.30,
		ShiborReference:    1.72,
		UpdatedAt:          time.Now().UTC(),
	}, nil
}
