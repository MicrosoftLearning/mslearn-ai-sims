---
lab:
    title: 'Explore an AI information extraction scenario'
    description: 'Explore an application that demonstrates how AI can be used to extract the information required for an expense claim from a scanned receipt.'
---

# Explore an AI information extraction scenario

In this exercise you will use an application that simulates an AI-powered receipt analysis application. The application extracts the fields required to process an expense claim from a scanned receipt.

This exercise should take approximately **15** minutes to complete.

## Extract fields from receipts

Suppose an organization needs to automate expense claim processing. One requirement for such an application might be to locate and extract key information from scanned receipts, which may be in multiple styles and layouts.

1. In a web browser, open the [Receipt Analyzer app](https://aka.ms/mslearn-ai-info-sim){:target="_blank"} app at `https://aka.ms/mslearn-ai-info-sim`.
1. Use the **Upload Receipt** button to open **receipt-1.png**. When the image opens, wait for the analysis to finish and review the information extracted from the receipt - which should include the vendor name, the transaction date, and the total amount.
1. Note that the app has extracted the field values and also their locations within the receipt; which are marked on the image.
1. Repeat the process to analyze receipts 2 and 3; noting that the right information is extracted, even though the receipts vary in layout, style, and formatting for numbers and dates.

> **Note**: The application used in this exercise is a *simulation* - there's no actual AI computer vision service behind it. However, it's based on real capabilities you can implement with [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/); and in particular, the [Azure AI Document Intelligence](https://azure.microsoft.com/products/ai-services/ai-document-intelligence/) and [Azure AI Content Understanding](https://azure.microsoft.com/products/ai-services/ai-content-understanding) services.
