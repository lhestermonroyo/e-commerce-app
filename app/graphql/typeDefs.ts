import { gql } from 'apollo-server';

export default gql`
  scalar DateTime
  # User
  type Session {
    token: String!
    user: User!
  }
  type User {
    user_id: ID!
    email: String!
    fullname: String!
    phone: String!
    role: Role!
    paymentmethod_list: [PaymentMethods]
    address_list: [Address]
    created_at: DateTime!
  }
  enum Role {
    user
    admin
  }
  type PaymentMethods {
    id: ID!
    user_id: ID!
    type: PaymentType!
    card_number: String
    expiration_date: String
    cvv: String
  }
  type Address {
    id: ID!
    user_id: ID!
    address: String!
    city: String!
    state: String!
    zip: String!
  }
  enum PaymentType {
    credit
    debit
    paypal
    stripe
    CASH
  }
  input UserInput {
    email: String!
    password: String
    confirm_password: String
    fullname: String!
    phone: String!
    role: String!
  }
  input PaymentMethodInput {
    type: PaymentType!
    card_number: String
    expiration_date: String
    cvv: String
  }
  input AddressInput {
    address: String!
    city: String!
    state: String!
    zip: String!
  }
  # Query
  type Query {
    getProfile(email: String!): User
  }
  # Mutation
  type Mutation {
    signUp(userInput: UserInput!): Session
    signIn(email: String!, password: String!): Session
    updateProfile(userInput: UserInput!): User
    addPaymentMethod(paymentMethodInput: PaymentMethodInput!): User
    updatePaymentMethod(
      paymentMethodInput: PaymentMethodInput!
      id: String!
    ): User
    deletePaymentMethod(id: String!): User
    addAddress(addressInput: AddressInput!): User
    updateAddress(addressInput: AddressInput!, id: String!): User
    deleteAddress(id: String!): User
  }
`;
