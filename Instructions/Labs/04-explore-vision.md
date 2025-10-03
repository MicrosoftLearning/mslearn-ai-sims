---
lab:
    title: 'Explore computer vision scenarios'
    description: 'Explore a applications that demonstrates how AI computer vision capabilities can be used to analyze images, generate captions and tags, and detect objects.'
---

# Explore computer vision scenarios

In this exercise you will use applications that simulate AI-powered computer vision capabilities.

This exercise should take approximately **15** minutes to complete.

## Analyze images

Suppose you work in a web publishing organization that uses images in articles. For each image, you need to include a caption - either as a visible description of the image or as alt-text for screen-reading software.

1. In a web browser, open the [Photo Tagger](https://aka.ms/photo-tagger){:target="_blank"} app at `https://aka.ms/photo-tagger`.
1. Use the **Upload Image** button to open **image1.jpg**. When the image opens, wait for the analysis to finish and review the caption that is generated for the image.
1. Use the **Suggested tags** button to generate relevant tags for the image.
    
    Organizations that create and publish content often need to create and maintain a *digital asset management* solution - essentially a library of digital assets like images that can be searched based on relevant keywords, or *tags*.

1. Repeat the process for images 2, 3, and 4 reviewing the captions and tags that are generated.

    Note that if an image contains text, the app uses *optical character recognition* (OCR) to detect and read it.

## Detect objects in images

Let's look at a different example of computer vision. AI-powered doorbell cameras have become popular in recent years for home security and convenience. In this case, the doorbell camera detects motion and takes a photograph. You can then use the companion app to detect the presence of people or animals in the captured images.

1. In a web browser, open the [Doorbell Photo Viewer](https://aka.ms/doorbell){:target="_blank"} app at `https://aka.ms/doorbell`.
1. In the **Photo Thumbnails** panel, select any of the captured images.
1. View the analyzed image, in which any detected people or animals are highlighted.
1. View the other thumbnails to see the objects detected in them.

> **Note**: The applications used in this exercise are *simulations* - there are no actual AI computer vision service behind them. However, they're based on real capabilities you can implement with [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/){:target="_blank"}; and in particular, the [Azure AI Vision](https://azure.microsoft.com/products/ai-services/ai-vision/){:target="_blank"} service.
