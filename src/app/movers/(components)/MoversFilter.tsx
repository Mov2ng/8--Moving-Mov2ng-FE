import React from 'react'
import RegionDropdown from './RegionDropdown'
import ServiceDropdown from './ServiceDropdown'
import { regionTypeOption, serviceTypeOption } from '@/types/queryType'
import { useState } from 'react'
import type { QuerySelectType } from '@/types/queryType'


interface MoversFilterProps {
  t: (key: any) => string;
  selectedRegion: QuerySelectType;
  setSelectedRegion: (region: QuerySelectType) => void;
  selectedService: QuerySelectType;
  setSelectedService: (service: QuerySelectType) => void;
  onClickReset: () => void;
}

function MoversFilter({ t, onClickReset, selectedRegion, setSelectedRegion, selectedService, setSelectedService }: MoversFilterProps) {
  return (
    <>
    <div className="flex items-center justify-between border-b border-line-200 px-[10px] py-4 max-md:hidden">
      <p className="pret-xl-medium text-black">{t("filter")}</p>
      <button
        className="pret-lg-medium text-gray-300 cursor-pointer"
        onClick={onClickReset}
      >
        {t("reset")}
      </button>
    </div>
    <div>
      <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
        {t("select_region")}
      </p>
      <RegionDropdown
        regionList={regionTypeOption(t)}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
      />
    </div>
    <div>
      <p className="pret-2lg-medium text-black-400 mb-4 max-md:hidden">
        {t("select_service")}
      </p>
      <ServiceDropdown
        serviceList={serviceTypeOption(t)}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
      />
    </div>
    </>
  )
}

export default MoversFilter