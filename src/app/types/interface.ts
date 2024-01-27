export enum WashDetailAccessType {
  USER = "USER",
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export enum Role {
  WASHER = "WASHER",
  ADMIN = "ADMIN",
}

export enum WashStatus {
  ACCEPTED = "ACCEPTED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  CREATED = "CREATED",
  STARTED = "STARTED",
}

export enum RescheduleRequestStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  NOTIFIED = "NOTIFIED",
  REJECTED = "REJECTED",
  DISCARDED = "DISCARDED",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
}
