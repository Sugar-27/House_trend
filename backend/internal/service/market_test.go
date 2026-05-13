package service

import (
	"context"
	"testing"

	"github.com/Sugar-27/House_trend/backend/internal/model"
)

func TestMarketSummaryNormalizesMissingFilters(t *testing.T) {
	service := NewMarketService()

	summary, err := service.GetSummary(context.Background(), model.MarketFilter{})
	if err != nil {
		t.Fatalf("GetSummary returned error: %v", err)
	}

	if summary.Filter.City != "上海" {
		t.Fatalf("expected default city 上海, got %q", summary.Filter.City)
	}
	if summary.Filter.District != "全市" {
		t.Fatalf("expected default district 全市, got %q", summary.Filter.District)
	}
	if summary.Filter.HouseType != "二手房" {
		t.Fatalf("expected default house type 二手房, got %q", summary.Filter.HouseType)
	}
	if summary.TransactionCount <= 0 || summary.AveragePrice <= 0 || summary.TransactionArea <= 0 {
		t.Fatalf("expected positive summary metrics, got %#v", summary)
	}
}

func TestRateSnapshotUsesDefaultCity(t *testing.T) {
	service := NewRateService()

	snapshot, err := service.GetLatest(context.Background(), "")
	if err != nil {
		t.Fatalf("GetLatest returned error: %v", err)
	}

	if snapshot.City != "上海" {
		t.Fatalf("expected default city 上海, got %q", snapshot.City)
	}
	if snapshot.CommercialLoanRate <= 0 || snapshot.FundLoanRate <= 0 || snapshot.ShiborReference <= 0 {
		t.Fatalf("expected positive rate metrics, got %#v", snapshot)
	}
}
