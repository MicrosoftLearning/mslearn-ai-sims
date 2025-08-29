---
lab:
    title: 'Explore a computer vision scenario'
    description: 'Explore an application that demonstrates how AI computer vision capabilities can be used to analyze images and generate captions and tags for use in publishing and digital asset management scenarios.'
---

# Explore a computer vision scenario

In this exercise you will use an application that simulates an AI-powered photo tagging application. The application enables you to upload images for analysis, and generates appropriate captions and tags.

This exercise should take approximately **15** minutes to complete.

## Generate photo captions

Suppose you work in a web publishing organization that uses images in articles. For each image, you need to include a caption - either as a visible description of the image or as alt-text for screen-reading software.

1. In a web browser, open the [Photo Tagger app](https://aka.ms/mslearn-vision-sim){:target="_blank"} app at `https://aka.ms/mslearn-vision-sim`.
1. Use the **Upload Image** button to open **image1.jpg**. When the image opens, wait for the analysis to finish and review the caption that is generated for the image.
1. Repeat the process for images 2 and 3, reviewing the captions that are generated.

## Read text

Images often contain text, and an AI technique called *optical character recognition* (OCR) can be used to detect and read it.

1. Upload **image4.jpg** and review the generated caption.
1. Note that the image in the text is detected and read.

## Generate tags

Organizations that create and publish content often need to create and maintain a *digital asset management* solution - essentially a library of digital assets like images that can be searched based on relevant keywords, or *tags*.

1. Upload any of the images and review the generated caption.
1. Use the **Suggested tags** button to generate relevant tags for the image.
1. Repeat the process to generate tags for the other images.

> **Note**: The application used in this exercise is a *simulation* - there's no actual AI computer vision service behind it. However, it's based on real capabilities you can implement with [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/){:target="_blank"}; and in particular, the [Azure AI Vision](https://azure.microsoft.com/products/ai-services/ai-vision/){:target="_blank"} service.
