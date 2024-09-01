import React from 'react';

function AddForm({
  entityName,
  setEntityName,
  documentName,
  setDocumentName,
  locationFilter,
  setLocationFilter,
  yearFilter,
  setYearFilter,
  sectorFilter,
  setSectorFilter,
  regionFilter,
  setRegionFilter,
  ethicalValuesFilter,
  setEthicalValuesFilter,
  locations,
  years,
  sectors,
  regions,
  ethicalValues
}) {
  const handleEthicalValuesChange = (e) => {
    const { options } = e.target;
    const selectedValues = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setEthicalValuesFilter(selectedValues);
  };

  return (
    <div className="filter-container">
      {/* שדה טקסט להוספת שם היישות */}
      <input
        type="text"
        placeholder="Entity Name"
        value={entityName}
        onChange={(e) => setEntityName(e.target.value)}
        className="search-input"
        required
      />
      
      {/* שדה טקסט להוספת שם המסמך */}
      <input
        type="text"
        placeholder="Document Name"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value)}
        className="search-input"
        required
      />

      <div className="filter-row">
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          required
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          required
        >
          <option value="">Select Year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>{year}</option>
          ))}
        </select>

        <select
          value={sectorFilter}
          onChange={(e) => setSectorFilter(e.target.value)}
          required
        >
          <option value="">Select Sector</option>
          {sectors.map((sector, index) => (
            <option key={index} value={sector}>{sector}</option>
          ))}
        </select>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          required
        >
          <option value="">Select Region</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <select
        multiple
        value={ethicalValuesFilter}
        onChange={handleEthicalValuesChange}
        className="ethical-values-select"
        required
      >
        {ethicalValues.map((value, index) => (
          <option key={index} value={value}>{value}</option>
        ))}
      </select>
    </div>
  );
}

export default AddForm;
