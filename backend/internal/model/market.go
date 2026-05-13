package model

import "time"

// MarketFilter describes the query dimensions supported by market aggregation APIs.
type MarketFilter struct {
	City      string `json:"city"`
	District  string `json:"district"`
	HouseType string `json:"houseType"`
	Range     string `json:"range"`
}

// MarketSummary is the coarse-grained market overview returned to the web layer.
type MarketSummary struct {
	Filter             MarketFilter `json:"filter"`
	AveragePrice       int          `json:"averagePrice"`
	TransactionCount   int          `json:"transactionCount"`
	TransactionArea    int          `json:"transactionArea"`
	TransactionAmount  float64      `json:"transactionAmount"`
	GeneratedAt        time.Time    `json:"generatedAt"`
	DataFreshnessLabel string       `json:"dataFreshnessLabel"`
}

// RateSnapshot describes the latest financing indicators used by the rates page.
type RateSnapshot struct {
	City               string    `json:"city"`
	CommercialLoanRate float64   `json:"commercialLoanRate"`
	FundLoanRate       float64   `json:"fundLoanRate"`
	DownPaymentRatio   float64   `json:"downPaymentRatio"`
	ShiborReference    float64   `json:"shiborReference"`
	UpdatedAt          time.Time `json:"updatedAt"`
}

// HealthStatus is returned by the liveness endpoint.
type HealthStatus struct {
	Status      string    `json:"status"`
	Service     string    `json:"service"`
	Environment string    `json:"environment"`
	CheckedAt   time.Time `json:"checkedAt"`
}
