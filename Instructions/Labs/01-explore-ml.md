---
lab:
    title: 'Explore machine learning scenarios'
    description: 'Explore applications that demonstrate how a machine learning model can help you predict unknown information.'
---

# Explore machine learning scenarios

In this exercise you will use two applications that simulate the use of a machine learning model to predict unknown values.

This exercise should take approximately **15** minutes to complete.

## Generate predictions for apartment rental

Let's say you own an apartment in the thriving town of Dataville. You decide you want to rent out the apartment, and you need to determine an appropriate monthly rental amount that you can charge the tenant. Rent prices are based on a variety of factors related to the property and its location, so you're going to use a property web site that include a machine learning powered app to help you determine the right rental amount.

### Predict monthly rent amounts based on property features

1. In a web browser, open the [Home rental estimator](https://aka.ms/rent-predictor){:target="_blank"} app at `https://aka.ms/rent-predictor`.
1. To generate a rental prediction, set the following properties and then select **Predict Rent**:
    - **Postal Code**: Select one of the postal codes for the fictional town of Dataville.
    - **Apartment size**: Use the slider to set the size of your apartment in square feet.
    - **Bedrooms**: Select the number of bedrooms in your apartment.
1. Review the generated rent prediction.
1. Try adjusting the properties, and verify that the changes result in different rental predictions.

### Review model data

To create a machine learning model that predicts rental prices, some training data that includes known rental prices is used to determine a function that fits the *features* of an apartment (location, size, number of bedrooms, etc.) to the *label* the model needs to predict (in this case, the rental amount.)

1. Use the **View sample rental data** button to reveal a sample of the training data for the rental prediction model.

## Generate predictions for wheat seed species

Let's explore another example of how machine learning can help determine unknown information based on past observations.

Suppose an agricultural specialists needs to identify the type of wheat that will be grown from a seed. Machine learning can be used to determine the most probably wheat species based on seed measurements.

### Predict wheat types based on seed measurements

1. In a web browser, open the [Seed Identifier](https://aka.ms/seed-identifier){:target="_blank"} app at `https://aka.ms/seed-identifier`.
1. To generate a rental prediction, set the following properties and then select **Predict wheat species**:
    - **Seed length**: The overall length of the seed in millimeters.
    - **Seed width**: The width of the seed in millimeters.
    - **Groove length**: The length of the groove in the seed.
1. Review the generated wheat species prediction.
1. Try adjusting the properties, and verify that the changes result in different species predictions.

### Review model data

To create a machine learning model that predicts which wheat species a seed will grow, some training data that includes known species is used to determine a function that fits the *features* of an seed (length, width, groove length, etc.) to the *label* the model needs to predict (in this case, the species: 1 for *Kama* wheat, 2 for *Rosa* wheat, and 3 for *Canadian* wheat.)

1. Use the **Show sample data** button to reveal a sample of the training data for the seed species prediction model.

> **Note**: The applications used in this exercise are *simulations* - there are no actual machine learning models behind them and the features have been simplified. However, they're based on real models that were trained and tested using [Azure Machine Learning](https://azure.microsoft.com/products/machine-learning/){:target="_blank"} - a platform for machine learning model development, deployment, and management.
