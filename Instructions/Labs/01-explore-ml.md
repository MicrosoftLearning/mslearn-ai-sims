---
lab:
    title: 'Explore machine learning scenarios'
    description: 'Explore applications that demonstrate how a machine learning model can help you predict unknown information.'
---

# Explore machine learning scenarios

In this exercise you will explore applications that use machine learning to predict unknown values.

This exercise should take approximately **15** minutes to complete.

## Generate predictions for apartment rental

Let's say you own an apartment in the thriving town of Dataville. You decide you want to rent out the apartment, and you need to determine an appropriate monthly rental amount that you can charge the tenant. Rent prices are based on a variety of factors related to the property and its location, so you're going to use a property web site that include a machine learning powered app to help you determine the right rental amount.

### Predict monthly rent amounts based on property features

1. In a web browser, open the [Home rental estimator](https://aka.ms/rent-predictor){:target="_blank"} app at `https://aka.ms/rent-predictor`.
1. To generate a rental prediction, set the following properties and then select **Calculate Rent**:
    - **Postal Code**: Select one of the postal codes for the fictional town of Dataville.
    - **Property Size**: Use the slider to set the size of your property in square feet.
    - **Number of Bedrooms**: Select the number of bedrooms in your property.
1. Review the generated rent prediction.
1. Try adjusting the property details, and verify that the changes result in different rental predictions.

### Review rental data and model details

To create a machine learning model that predicts rental prices, some training data that includes known rental prices is used to determine a function that fits the *features* of an apartment (location, size, number of bedrooms, etc.) to the *label* the model needs to predict (in this case, the rental amount.)

1. Use the **Show sample data** button to reveal a sample of the training data for the rental prediction model.
1. Use the **Show model details** button to view information about the model, including the algorithm used to train it and the evaluation metrics calculated from validation data.

## Generate predictions for wheat seed species

Let's explore another example of how machine learning can help determine unknown information based on past observations.

Suppose an agricultural specialist needs to identify the type of wheat that will be grown from a seed. Machine learning can be used to determine the most probable wheat species based on seed measurements.

### Predict wheat types based on seed measurements

1. In a web browser, open the [Wheat Seed Identifier](https://aka.ms/seed-identifier){:target="_blank"} app at `https://aka.ms/seed-identifier`.
1. To generate a wheat species prediction, set the following properties and then select **Predict wheat species**:
    - **Seed length**: The overall length of the seed in millimeters.
    - **Seed width**: The width of the seed in millimeters.
    - **Groove length**: The length of the groove in the seed.
1. Review the generated wheat species prediction.
1. Try adjusting the properties, and verify that the changes result in different species predictions.

### Review wheat seed data and model details

To create a machine learning model that predicts which wheat species a seed will grow, some training data that includes known species is used to determine a function that fits the *features* of an seed (length, width, groove length, etc.) to the *label* the model needs to predict (in this case, the species: 0 for *Kama* wheat, 1 for *Rosa* wheat, and 2 for *Canadian* wheat.)

1. Use the **Show sample data** button to reveal a sample of the training data for the seed species prediction model.
1. Use the **Model details** button to view information about the model, including the algorithm used to train it and the evaluation metrics calculated from validation data.

## Segment customers based on spending patterns

Suppose a retail business wants to group customers into segments for marketing, based on spending patterns.

1. In a web browser, open the [Customer Segmentation](https://aka.ms/customer-segmentation){:target="_blank"} app at `https://aka.ms/customer-segmentation`.
1. Select **Upload Data** and open the **customers.csv** data file. This file contains records for customers, including their average frequency of purchases (in days) and their average spend per transaction.
1. With the file loaded, select **Analyze**. The app uses an algorithm called **K-means** to segment the customers into clusters.

    The algorithm tries to separate the data into *K* clusters based on the mean distance between the data points and the cluster centers. In this case, the app tries *K* values of 3 to 5 before selecting the one that results in the best separation of the data.

1. When the analysis is complete:
    - Review the updated data, noting that each customer has been assigned to a cluster.
    - Review the silhouette scores, which measure how well the clusters are separated for each *K* value that was tried (the score is a value between -1 and 1 - the closer to 1 the score is, the better the separation).
    - Review the cluster metrics, which include the average spend and purchase frequency for customers in each cluster.
    - Review the scatter plot, which shows a visualization of the clustered data.

    Each cluster represents a group of customers with similar spending habits.

> **Note**: The applications used in this exercise use machine learning models that are simple, and based on a small set of data features. In a real scenario, data scientists can use a range of machine learning frameworks with platforms like [Azure Machine Learning](https://azure.microsoft.com/products/machine-learning/){:target="_blank"} to develop, deploy, and manage machine learning models.
