import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { PaymentStatus, WashStatus } from "../types/interface";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const getTotalSales = (mine: any[]) =>
  mine
    .filter(
      (r) =>
        r.washStatus === WashStatus.ACCEPTED &&
        r.paymentStatus === PaymentStatus.PAID
    )
    .reduce((a, b) => a + b.chargedAmount, 0);

const getTotalUncollected = (mine: any[]) =>
  mine
    .filter(
      (r) =>
        r.washStatus === WashStatus.ACCEPTED &&
        r.paymentStatus === PaymentStatus.UNPAID
    )
    .reduce((a, b) => a + b.package.price, 0);

export const normalizeWashRequestForDashboard = (
  mine: any[],
  unassigned: any[]
) => {
  return {
    newWashRequests: unassigned.length,
    assignWashers: mine.length,
    totalSales: getTotalSales(mine) > 0 ? getTotalSales(mine) / 100 : 0,
    unCollectedSales:
      getTotalUncollected(mine) > 0 ? getTotalUncollected(mine) : 0,
    washesCompleted: mine.filter(
      (r) => !r.cancelled && r.accepted && r.completed
    ).length,
    washesPending: mine.filter(
      (r) => !r.cancelled && r.accepted && !r.completed
    ).length,
    cancelled: [...unassigned, ...mine].filter(
      (r) => r.washStatus === WashStatus.CANCELLED
    ).length,
    averageRating: 0,
    mine: mine.map((r) => ({
      key: r.id,
      model: r.selectedModel,
      color: r.color,
      package: r.package.name,
      status: r.washStatus === WashStatus.ACCEPTED ? "Accepted" : "Pending",
      date: dayjs.utc(r.washDateAndTimeUTC).local().format("MM/DD/YY h:mm A"),
      address: JSON.parse(r.address).formatted_address,
      washPro: r.washer ? r.washer.name : "Not Assigned",
      paid: r.paymentStatus === PaymentStatus.PAID ? "Yes" : "No",
      rating: r.rating,
      name: r.customer.name,
      email: r.customer.email,
      fullAddress: JSON.parse(r.address),
      fullCustomer: r.customer,
      fullPackage: r.package,
    })),
    unassigned: unassigned.map((r) => ({
      key: r.id,
      model: r.selectedModel,
      color: r.color,
      package: r.package.name,
      status: r.washStatus === WashStatus.ACCEPTED ? "Accepted" : "Pending",
      date: dayjs.utc(r.washDateAndTimeUTC).local().format("MM/DD/YY h:mm A"),
      address: JSON.parse(r.address).formatted_address,
      washPro: r.washer ? r.washer.name : "Not Assigned",
      paid: r.paymentStatus === PaymentStatus.PAID ? "Yes" : "No",
      rating: r.rating,
      name: r.customer.name,
      email: r.customer.email,
      fullAddress: JSON.parse(r.address),
      fullCustomer: r.customer,
      fullPackage: r.package,
    })),
  };
};

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

export const normalizeWashRequestForCalendar = (mine: any[]) => {
  const filteredWashes = mine.filter((r) => r.completed !== true);

  const washesByDate: any = {};
  const todayDate = dayjs().format("MM-DD-YYYY");

  filteredWashes.forEach((r) => {
    const washDate = dayjs.utc(r.washDateAndTimeUTC).local();
    const dateKey = washDate.format("MM-DD-YYYY");

    if (!washesByDate[dateKey]) {
      washesByDate[dateKey] = [];
    }

    washesByDate[dateKey].push({
      key: r.id,
      model: r.selectedModel,
      color: r.color,
      package: r.package.name,
      status: r.washStatus === WashStatus.ACCEPTED ? "Accepted" : "Pending",
      date: washDate.format("MMM DD, YYYY"),
      time: washDate.format("h:mm A"),
      address: JSON.parse(r.address).formatted_address,
      washPro: r.washer ? r.washer.name : "Not Assigned",
      paid: r.paymentStatus === PaymentStatus.PAID ? "Yes" : "No",
      rating: r.rating,
      name: r.customer.name,
      email: r.customer.email,
      createdAt: r.createdAt,
      fullAddress: JSON.parse(r.address),
      fullCustomer: r.customer,
      fullPackage: r.package,
      dotColor: `#${randomColor()}`,
    });
  });

  // Fetch today's washes
  const todayWashes = washesByDate[todayDate] || [];

  return {
    today: todayWashes,
    ...washesByDate,
  };
};
