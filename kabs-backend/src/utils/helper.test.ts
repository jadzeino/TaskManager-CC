import { validateTaskStatusTransition } from "./helper";

describe("validateTaskStatusTransition", () => {
  it("should not throw an error for valid status transition", () => {
    expect(() =>
      validateTaskStatusTransition("ToDo", "InProgress")
    ).not.toThrow();
    expect(() =>
      validateTaskStatusTransition("InProgress", "Blocked")
    ).not.toThrow();
    expect(() =>
      validateTaskStatusTransition("InProgress", "InQA")
    ).not.toThrow();
    expect(() => validateTaskStatusTransition("Blocked", "ToDo")).not.toThrow();
    expect(() => validateTaskStatusTransition("InQA", "ToDo")).not.toThrow();
    expect(() => validateTaskStatusTransition("InQA", "Done")).not.toThrow();
    expect(() =>
      validateTaskStatusTransition("Done", "Deployed")
    ).not.toThrow();
  });

  it("should throw an error for invalid current status", () => {
    expect(() =>
      validateTaskStatusTransition("InvalidStatus", "InProgress")
    ).toThrow("Invalid current status: InvalidStatus");
  });

  it("should throw an error for invalid status transition", () => {
    expect(() => validateTaskStatusTransition("ToDo", "Done")).toThrow(
      "Invalid status transition from ToDo to Done"
    );
    expect(() => validateTaskStatusTransition("InProgress", "ToDo")).toThrow(
      "Invalid status transition from InProgress to ToDo"
    );
    expect(() => validateTaskStatusTransition("Blocked", "InQA")).toThrow(
      "Invalid status transition from Blocked to InQA"
    );
    expect(() => validateTaskStatusTransition("Done", "ToDo")).toThrow(
      "Invalid status transition from Done to ToDo"
    );
  });
});
