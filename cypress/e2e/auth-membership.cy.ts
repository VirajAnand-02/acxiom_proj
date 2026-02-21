describe("auth + role gate + membership flow", () => {
  it("logs in as admin and creates membership", () => {
    const membershipNumber = `MEM-E2E-${Date.now()}`;

    cy.visit("/login");
    cy.get("#email").type("admin@example.com");
    cy.get("#password").type("AdminPass1!");
    cy.contains("button", "Sign In").click();

    cy.url().should("include", "/dashboard");
    cy.visit("/admin/maintenance/add-membership");
    cy.get("#membershipNumber").type(membershipNumber);
    cy.get("#vendorEmail").clear().type("vendor@example.com");
    cy.get("#startDate").type("2026-02-21");
    cy.contains("button", "Add Membership").click();

    cy.contains("Membership created");
  });

  it("logs in as user and is blocked from admin maintenance", () => {
    cy.visit("/login");
    cy.get("#email").type("user@example.com");
    cy.get("#password").type("UserPass1!");
    cy.contains("button", "Sign In").click();
    cy.visit("/admin/maintenance");
    cy.url().should("not.include", "/admin/maintenance");
  });
});
