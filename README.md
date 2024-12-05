Welcome to ML-Explorer !

It is an easy way to get familiar with the basics of machine learning

What you can do here:

- loading tabular data (from a pre-loaded CSV with JSON metadata, or from a user-uploaded CSV)

- choosing which column to predict (the label)

- choosing which column(s) to use for the prediction (the features)

- handling both categorical and continuous (numerical) columns

- viewing per-column graphs and metadata

- viewing custom CrossTab tables for comparing categorical columns

- viewing scatter plot graphs for comparing continuous columns

- using KNN classification or KNN regression to train a model

- choosing the subset of data to reserve for validation

- measuring accuracy of the resulting trained model using reserved data

- using the trained model by doing predictions

- saving the trained model to the server

  Navigation:

The app uses a scene-by-scene approach, with centralized logic to control when the "Previous" and "Next" buttons are shown and enabled. For example, the "Next" button won't work until the user selects a label.

Dynamic Instructions:

I leverage the existing instructions system from the main repo, but needed a way to provide instructions specific to each scene. Dynamic Instructions were created for this. They are concise, tailored to the current scene, and easy for curriculum designers to update. These instructions are fully readable without scrolling and use the same text-to-speech system.

Responsiveness:

The app is horizontally responsive and works well in landscape mode on mobile. It also adjusts vertically using flexbox, with some elements fixed in height and others adjustable.

Adding a Dataset:

To add a new dataset, you need three files: .csv, .json, and .jpg. After adding these to the correct folder, update the .json file with the dataset details. Test the dataset by checking if the column metadata displays correctly in the app’s panel.

Take care that each column is correctly listed in the .json file, and test that it's working in the tool by highlighting each column and ensuring that its metadata shows correctly in the panel on the right.

 Data display (label & features)

This scene went through major iteration, before settling on the current implementation. The scene is used twice, once to select a label and again to select features. It tries to achieve a number of objectives:

  -  it centers the tabular data in the student experience;
  - it allows the construction of a statement ("Predict [feature] based on [labels].") which carries across the experience;
  - it allows for the exploration of columns and their properties before they are selected.

When selecting a label, the properties panel on the right shows information for the highlighted column:

  - a bar graph for categorical data;
  - min/max/range for numerical data.

Train Model

 Here, the aim is to illustrate the training process, in which a large amount of the original tabular data is given to the bot, row by row.

Generate Results

Here, the bot is making predictions on rows that were reserved for this purpose: it takes the features and predicts the label for each of those rows.

Results

- It shows the result for the most recent set of predictions. That is, it shows the statement ("Predict [feature] based on [labels].") along with the accuracy (which is how well it predicted labels in the previous scene, when comparing those labels against their actual values, since this prediction was done using a reserved set of data from the original tabular data).

- It shows the results of previous sets of predictions, with their respective statements. This way the user can compare statements to see which have the highest "predictive power".

- It lets the user view details of the most recent set of predictions, which shows in a pop-up. This view has a toggle between showing correct and incorrect predictions. In the table, the user can examine each row of reserved data to see how the label's actual value compares to what was predicted.


Save Model

The user can fill out the "model card" and then save the model, along with the model card information, to the server. This model can then be imported in App Lab. The model card information is seen in App Lab when previewing the model prior to importing it. Model cards serve as an accessible reference for an AI model. They allow the student to document decisions. And analyzing model cards in the curriculum helps users to explore issues of bias and ethics.
