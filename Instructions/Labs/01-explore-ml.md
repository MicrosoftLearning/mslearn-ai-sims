---
lab:
    title: 'Explore a machine learning scenario'
    description: 'Explore an application that demonstrates how a machine learning model can help you determine appropriate rental pricing for an apartment.'
---

# Explore a machine learning scenario

In this exercise you will use an application that simulates the use of a machine learning model to predict rental income for an apartment based on its features.

This exercise should take approximately **15** minutes to complete.

## Generate predictions for apartment rental

Let's say you own an apartment in the thriving town of Dataville. You decide you want to rent out the apartment, and you need to determine an appropriate monthly rental amount that you can charge the tenant. Rent prices are based on a variety of factors related to the property and its location, so you're going to use a property web site that include a machine learning powered app to help you determine the right rental amount.

1. In a web browser, open the [Home rental estimator](https://aka.ms/mslearn-ml-sim) app at `https://aka.ms/mslearn-ml-sim`.
1. To generate a rental prediction, set the following properties and then select **Predict Rent**:
    - **Postal Code**: Select one of the postal codes for the fictitious town of Dataville.
    - **Apartment size**: Use the slider to set the size of your apartment in square feet.
    - **Bedrooms**: Select the number of bedrooms in your apartment.
1. Review the generated rent prediction.
1. Try adjusting the properties, and verify that the changes result in different rental predictions.

## Review model data

To create a machine learning model that predicts rental prices, some training data that includes known rental prices is used to determine a function that fits the *features* of an apartment (location, size, number of bedrooms, etc.) to the *label* the model needs to predict (in this case, the rental amount.)

1. Use the **View sample rental data** button to reveal a sample of the training data for the rental prediction model.

> **Note**: The application used in this exercise is a *simulation* - there's no actual machine learning model behind it. However, it's based on a real model that was trained and tested using [Azure Machine Learning](https://azure.microsoft.com/products/machine-learning/) - a platform for machine learning model development, deployment, and management.
