import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import SummaryCard from "../../components/SummaryCard";
import policyIcon from "../../assets/policyy.png";
import premiumIcon from "../../assets/premium.png";
import renewalsIcon from "../../assets/renewals.png";
import averageIcon from "../../assets/average.png";
import activePremiumsIcon from "../../assets/activePremiums.png";
import customersIcon from "../../assets/customerss.png";
import attentionIcon from "../../assets/attention.png";
import { useAuthContext } from "../../context/AuthContext";
import { getPolicies } from "../../api/policyApi";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { user, userData } = useAuthContext();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalPolicies: 0,
    activePolicies: 0,
    expiredPolicies: 0,
    totalPremium: 0,
    upcomingRenewals: 0,
    monthlyAverage: 0,
    totalActivePremiums: 0,
    totalCustomers: 0,
    requireAttention: 0,
    policyDistribution: {},
    monthlyPerformance: [],
  });

  // Fetch policies from database
  useEffect(() => {
    const fetchPolicies = async () => {
      if (!user || !user.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getPolicies(user.uid);
        if (response && response.success) {
          setPolicies(response.policies || []);
        } else {
          console.warn("Unexpected response format:", response);
          toast.error("Unexpected response from server");
          setPolicies([]);
        }
      } catch (error) {
        console.error("Error fetching policies:", error);
        const errorMessage = error.response?.data?.error || 
                           error.message || 
                           "Failed to load dashboard data. Make sure the backend server is running.";
        toast.error(errorMessage);
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, [user]);

  // Calculate dashboard metrics
  useEffect(() => {
    if (policies.length === 0) {
      setDashboardData({
        totalPolicies: 0,
        activePolicies: 0,
        expiredPolicies: 0,
        totalPremium: 0,
        upcomingRenewals: 0,
        monthlyAverage: 0,
        totalActivePremiums: 0,
        totalCustomers: 0,
        requireAttention: 0,
        policyDistribution: {},
        monthlyPerformance: [],
      });
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    let totalPremium = 0;
    let activePremium = 0;
    let activePolicies = 0;
    let expiredPolicies = 0;
    let upcomingRenewals = 0;
    let requireAttention = 0;
    const customers = new Set();
    const policyDistribution = {};

    policies.forEach((policy) => {
      // Count policies by status
      if (policy.status === "Active") {
        activePolicies++;
      } else if (policy.status === "Expired") {
        expiredPolicies++;
      }

      // Calculate total premium
      const premium = Number(policy.premiumAmount) || 0;
      totalPremium += premium;

      // Calculate active premiums
      if (policy.status === "Active") {
        activePremium += premium;
      }

      // Count unique customers
      if (policy.customer?.email) {
        customers.add(policy.customer.email);
      }

      // Policy distribution by type
      const policyType = policy.policyType || "Others";
      policyDistribution[policyType] = (policyDistribution[policyType] || 0) + 1;

      // Parse end date
      let endDate = null;
      if (policy.endDate) {
        if (policy.endDate.seconds) {
          endDate = new Date(policy.endDate.seconds * 1000);
        } else if (policy.endDate._seconds) {
          endDate = new Date(policy.endDate._seconds * 1000);
        } else if (typeof policy.endDate === "string") {
          endDate = new Date(policy.endDate);
        }
      }

      // Upcoming renewals (policies expiring this month)
      if (endDate && policy.status === "Active") {
        const expiryMonth = endDate.getMonth();
        const expiryYear = endDate.getFullYear();
        if (expiryMonth === currentMonth && expiryYear === currentYear) {
          upcomingRenewals++;
        }
      }

      // Require attention (expiring in next 30 days or already expired)
      if (endDate) {
        const isExpired = endDate < now;
        const isExpiringSoon = endDate >= now && endDate <= thirtyDaysFromNow;
        if (isExpired || isExpiringSoon) {
          requireAttention++;
        }
      }
    });

    // Calculate monthly average
    // Convert annual premium to monthly based on premiumType
    let monthlyTotal = 0;
    policies.forEach((policy) => {
      const premium = Number(policy.premiumAmount) || 0;
      const premiumType = policy.premiumType || "Yearly";
      
      let monthlyEquivalent = 0;
      switch (premiumType) {
        case "Monthly":
          monthlyEquivalent = premium;
          break;
        case "Quarterly":
          monthlyEquivalent = premium / 3;
          break;
        case "Half-Yearly":
          monthlyEquivalent = premium / 6;
          break;
        case "Yearly":
          monthlyEquivalent = premium / 12;
          break;
        case "Single":
          monthlyEquivalent = 0; // One-time payment
          break;
        default:
          monthlyEquivalent = premium / 12; // Default to yearly
      }
      monthlyTotal += monthlyEquivalent;
    });

    const monthlyAverage = policies.length > 0 ? monthlyTotal / policies.length : 0;

    // Calculate monthly performance (last 6 months)
    const monthlyPerformance = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthName = monthNames[month];
      
      // Count policies created in this month
      let policiesCount = 0;
      let premiumAmount = 0;
      
      policies.forEach((policy) => {
        let createdAt = null;
        if (policy.createdAt) {
          if (policy.createdAt.seconds) {
            createdAt = new Date(policy.createdAt.seconds * 1000);
          } else if (policy.createdAt._seconds) {
            createdAt = new Date(policy.createdAt._seconds * 1000);
          } else if (typeof policy.createdAt === "string") {
            createdAt = new Date(policy.createdAt);
          }
        }
        
        if (createdAt && !isNaN(createdAt.getTime())) {
          const policyMonth = createdAt.getMonth();
          const policyYear = createdAt.getFullYear();
          if (policyMonth === month && policyYear === year) {
            policiesCount++;
            premiumAmount += Number(policy.premiumAmount) || 0;
          }
        }
      });
      
      monthlyPerformance.push({
        month: monthName,
        policies: policiesCount,
        premium: premiumAmount,
      });
    }

    setDashboardData({
      totalPolicies: policies.length,
      activePolicies,
      expiredPolicies,
      totalPremium,
      upcomingRenewals,
      monthlyAverage,
      totalActivePremiums: activePremium,
      totalCustomers: customers.size,
      requireAttention,
      policyDistribution,
      monthlyPerformance,
    });
  }, [policies]);

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return `₹${Number(amount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  };

  // Format number
  const formatNumber = (num) => {
    return Number(num).toLocaleString("en-IN");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* fixed navbar */}
     
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Greeting */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Welcome, Agent {userData?.username || "Agent"}
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your policy portfolio and recent activity.
        </p>

        {/* Top Summary Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Total Policies"
            text={`${dashboardData.activePolicies} active, ${dashboardData.expiredPolicies} expired`}
            value={loading ? "Loading..." : formatNumber(dashboardData.totalPolicies)}
            iconSrc={policyIcon}
          />
          <SummaryCard
            title="Total Premium"
            text="Annual premium amount"
            value={loading ? "Loading..." : formatCurrency(dashboardData.totalPremium)}
            iconSrc={premiumIcon}
          />
          <SummaryCard
            title="Upcoming Renewals"
            text="Due this month"
            value={loading ? "Loading..." : formatNumber(dashboardData.upcomingRenewals)}
            iconSrc={renewalsIcon}
          />
          <SummaryCard
            title="Monthly Average"
            text="Average monthly premium"
            value={loading ? "Loading..." : formatCurrency(dashboardData.monthlyAverage)}
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
    {loading ? (
      <div className="h-64 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    ) : dashboardData.monthlyPerformance.length === 0 ? (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No data available
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={256}>
        <LineChart data={dashboardData.monthlyPerformance}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="month" 
            stroke="#666"
            style={{ fontSize: "12px" }}
          />
          <YAxis 
            stroke="#666"
            style={{ fontSize: "12px" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#fff", 
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "12px"
            }}
            formatter={(value) => [`${value}`, "Policies"]}
          />
          <Line 
            type="monotone" 
            dataKey="policies" 
            stroke="#0A2A67" 
            strokeWidth={2}
            dot={{ fill: "#0A2A67", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>

  {/* Card 2: Policy Distribution */}
  <div className="relative bg-white shadow rounded-xl p-6 border border-gray-200 overflow-hidden">
    {/* left accent */}
    <div className="absolute inset-y-0 left-0 w-1 bg-[#0A2A67]" />
    <h3 className="text-lg font-semibold text-gray-800 mb-4">
      Policy Distribution
    </h3>
    <div className="h-64 overflow-y-auto">
      {loading ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          Loading...
        </div>
      ) : Object.keys(dashboardData.policyDistribution).length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          No policies yet
        </div>
      ) : (
        <div className="space-y-3">
          {Object.entries(dashboardData.policyDistribution).map(([type, count]) => (
            <div key={type} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">{type}</span>
              <span className="text-sm font-bold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
</div>


        {/* Bottom Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-blue-500 text-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img src={activePremiumsIcon} alt="Active Premiums" className="h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? "Loading..." : formatCurrency(dashboardData.totalActivePremiums)}
                </p>
                <p>Total Active Premiums</p>
              </div>
            </div>
          </div>

          <div className="bg-green-500 text-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img src={customersIcon} alt="Customers" className="h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? "Loading..." : formatNumber(dashboardData.totalCustomers)}
                </p>
                <p>Total Customers</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-500 text-white rounded-xl shadow p-6 flex flex-col justify-between">
            <div className="flex items-center space-x-4">
              <img src={attentionIcon} alt="Require Attention" className="h-10 w-10" />
              <div>
                <p className="text-2xl font-bold">
                  {loading ? "Loading..." : formatNumber(dashboardData.requireAttention)}
                </p>
                <p>Require Attention</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
