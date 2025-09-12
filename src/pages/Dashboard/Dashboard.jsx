import SummaryCard from "../../components/SummaryCard";
import policyIcon from "../../assets/policyy.png";
import premiumIcon from "../../assets/premium.png";
import renewalsIcon from "../../assets/renewals.png";
import averageIcon from "../../assets/average.png";
import activePremiumsIcon from "../../assets/activePremiums.png";
import customersIcon from "../../assets/customerss.png";
import attentionIcon from "../../assets/attention.png";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* fixed navbar */}
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Greeting */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome, Agent {"{X}"}
        </h1>
        <p className="text-gray-600 mt-2">
          Here’s an overview of your policy portfolio and recent activity.
        </p>

        {/* Top Summary Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Policies"
            text="N active, N expired"
            value="N"
            iconSrc={policyIcon}
          />
          <SummaryCard
            title="Total Premium"
            text="Annual premium amount"
            value="N"
            iconSrc={premiumIcon}
          />
          <SummaryCard
            title="Upcoming Renewals"
            text="Due this month"
            value="N"
            iconSrc={renewalsIcon}
          />
          <SummaryCard
            title="Monthly Average"
            text="Average monthly premium"
            value="N"
            iconSrc={averageIcon}
          />
        </div>

       {/* Graph Section */}
<div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Card 1: Monthly Performance */}
  <div className="relative col-span-2 bg-white shadow rounded-xl p-6 border border-gray-200 overflow-hidden">
    {/* left accent */}
    <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Monthly Performance
    </h3>
    <div className="h-64 flex items-center justify-center text-gray-400">
      Graph for agent’s performance tracking
    </div>
  </div>

  {/* Card 2: Policy Distribution */}
  <div className="relative bg-white shadow rounded-xl p-6 border border-gray-200 overflow-hidden">
    {/* left accent */}
    <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Policy Distribution
    </h3>
    <div className="h-64 flex items-center justify-center text-gray-400">
      Type of policy with numbers
    </div>
  </div>
</div>


        {/* Bottom Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img src={activePremiumsIcon} alt="Active Premiums" className="h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">N</p>
                <p>Total Active Premiums</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500 text-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img src={customersIcon} alt="Customers" className="h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">N</p>
                <p>Total Customers</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-500 text-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img src={attentionIcon} alt="Require Attention" className="h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">N</p>
                <p>Require Attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
