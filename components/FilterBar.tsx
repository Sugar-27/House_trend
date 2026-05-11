"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { dateRangeBounds, filters, type City, type HouseType, type MarketFilterState, type PresetTimeRange } from "@/lib/mockData";

type FilterBarProps = {
  activeFilters: MarketFilterState;
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectKey = "city" | "houseType" | "district";

type CustomSelectProps = {
  id: SelectKey;
  label: string;
  value: string;
  options: SelectOption[];
  isOpen: boolean;
  onToggle: (id: SelectKey) => void;
  onClose: () => void;
  onChange: (value: string) => void;
};

function CustomSelect({ id, label, value, options, isOpen, onToggle, onClose, onChange }: CustomSelectProps) {
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <div
      className={`filter-field custom-select${isOpen ? " is-open" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onClose();
        }
      }}
    >
      <span>{label}</span>
      <div className="custom-select-control">
        <button
          type="button"
          className="custom-select-trigger"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => onToggle(id)}
        >
          <strong>{selectedOption?.label}</strong>
          <em aria-hidden="true">⌄</em>
        </button>
        {isOpen && (
          <div className="custom-select-menu" role="listbox" aria-label={label}>
            {options.map((option) => (
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                className={option.value === value ? "active" : undefined}
                onClick={() => {
                  onChange(option.value);
                  onClose();
                }}
                key={option.value}
              >
                <span>{option.label}</span>
                {option.value === value && <em aria-hidden="true">✓</em>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterBar({ activeFilters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const districtOptions = filters.districtsByCity[activeFilters.city];
  const [openSelect, setOpenSelect] = useState<SelectKey | null>(null);

  const updateFilter = (key: keyof MarketFilterState, value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set(key, value);

    if (key === "city") {
      nextParams.set("district", "全市");
    }

    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const updateDateRange = (key: "startDate" | "endDate", value: string) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const nextStartDate = key === "startDate" ? value : activeFilters.startDate;
    const nextEndDate = key === "endDate" ? value : activeFilters.endDate;

    nextParams.delete("range");
    nextParams.set("startDate", nextStartDate <= nextEndDate ? nextStartDate : nextEndDate);
    nextParams.set("endDate", nextStartDate <= nextEndDate ? nextEndDate : nextStartDate);
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  const applyPresetRange = (range: PresetTimeRange) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("range", range);
    nextParams.delete("startDate");
    nextParams.delete("endDate");
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  return (
    <section className="filter-bar" aria-label="全局筛选条件">
      <CustomSelect
        id="city"
        label="城市"
        value={activeFilters.city}
        options={filters.cities.map((city) => ({ label: city, value: city }))}
        isOpen={openSelect === "city"}
        onToggle={(id) => setOpenSelect((current) => (current === id ? null : id))}
        onClose={() => setOpenSelect(null)}
        onChange={(value) => updateFilter("city", value as City)}
      />
      <CustomSelect
        id="houseType"
        label="房屋类型"
        value={activeFilters.houseType}
        options={filters.houseTypes}
        isOpen={openSelect === "houseType"}
        onToggle={(id) => setOpenSelect((current) => (current === id ? null : id))}
        onClose={() => setOpenSelect(null)}
        onChange={(value) => updateFilter("houseType", value as HouseType)}
      />
      <CustomSelect
        id="district"
        label="区域"
        value={activeFilters.district}
        options={districtOptions.map((district) => ({ label: district, value: district }))}
        isOpen={openSelect === "district"}
        onToggle={(id) => setOpenSelect((current) => (current === id ? null : id))}
        onClose={() => setOpenSelect(null)}
        onChange={(value) => updateFilter("district", value)}
      />
      <div className="filter-field date-range-field">
        <span>时间范围</span>
        <div className="date-range-inputs" aria-label="自定义日期范围">
          <label>
            <small>开始日期</small>
            <input
              type="date"
              min={dateRangeBounds.min}
              max={dateRangeBounds.max}
              value={activeFilters.startDate}
              onChange={(event) => updateDateRange("startDate", event.target.value)}
            />
          </label>
          <label>
            <small>结束日期</small>
            <input
              type="date"
              min={dateRangeBounds.min}
              max={dateRangeBounds.max}
              value={activeFilters.endDate}
              onChange={(event) => updateDateRange("endDate", event.target.value)}
            />
          </label>
        </div>
        {activeFilters.warning && <p className="filter-warning">{activeFilters.warning}</p>}
        <div className="range-shortcuts" aria-label="快捷时间范围">
          {filters.ranges.map((range) => (
            <button
              type="button"
              className={activeFilters.range === range ? "active" : undefined}
              onClick={() => applyPresetRange(range)}
              key={range}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
