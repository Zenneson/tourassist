import { sumAmounts } from "@libs/custom";
import { useEffect } from "react";

// Custom Hook for Updating Trip Data
export function useUpdateTripData(
  tripInfo,
  setTripData,
  tripData,
  setTripDesc,
  setUpdates
) {
  useEffect(() => {
    if (tripInfo && JSON.stringify(tripInfo) !== JSON.stringify(tripData)) {
      setTripData(tripInfo);
      setTripDesc(tripInfo.tripDesc);
      setUpdates(tripInfo.updates);
    }
  }, [tripInfo, setTripData]);
}

// Custom Hook for Synchronizing Donations
export function useSyncDonations(
  donations,
  tripData,
  setDonations,
  setDonationSum
) {
  useEffect(() => {
    if (
      tripData &&
      JSON.stringify(donations) !== JSON.stringify(tripData.donations)
    ) {
      setDonations(tripData.donations);
      setDonationSum(Math.floor(sumAmounts(tripData.donations)));
    }
  }, [tripData, setDonations, setDonationSum]);
}

// Custom Hook for Calculating Funds
export function useCalculateFunds(funds, donationSum, spentFunds, setFunds) {
  useEffect(() => {
    const newFunds = donationSum - spentFunds;
    if (funds !== newFunds) {
      setFunds(newFunds);
    }
  }, [donationSum, spentFunds]);
}

// Custom Hook for Updating Spent Funds
export function useUpdateSpentFunds(tripData, setSpentFunds, spentFunds) {
  useEffect(() => {
    if (tripData?.spentFunds !== spentFunds) {
      setSpentFunds(tripData.spentFunds);
    }
  }, [tripData, setSpentFunds]);
}

// Custom Hook for Loading Update Data
export function useLoadUpdateData(
  updates,
  tripData,
  setUpdates,
  setUpdateDataLoaded
) {
  useEffect(() => {
    if (tripData?.updates && (!updates || updates.length === 0)) {
      setUpdates(tripData.updates);
      setUpdateDataLoaded(true);
    }
  }, [tripData, setUpdates, setUpdateDataLoaded]);
}