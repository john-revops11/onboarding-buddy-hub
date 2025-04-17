export const ServiceTierSection = ({ tier, consultingAddOn, tierUrl, consultingUrl }) => (
  <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
    <h2 className="text-lg font-semibold mb-4">Your Revify Services</h2>

    <p className="mb-2">
      <span className="font-medium">Platform Tier:</span>{" "}
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{tier}</span>
      {tierUrl && (
        <a href={tierUrl} target="_blank" className="ml-2 text-blue-600 underline text-sm">
          View Platform Features →
        </a>
      )}
    </p>

    <p>
      <span className="font-medium">Consulting Add-On:</span>{" "}
      {consultingAddOn || "None Selected"}
      {consultingUrl && (
        <a href={consultingUrl} target="_blank" className="ml-2 text-blue-600 underline text-sm">
          Explore Options →
        </a>
      )}
    </p>
  </div>
);
