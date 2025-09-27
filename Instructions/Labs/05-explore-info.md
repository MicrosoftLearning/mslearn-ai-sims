---
lab:
    title: 'Explore AI information extraction scenarios'
    description: 'Explore applications that demonstrates how AI can be used to extract the information from content in multiple formats.'
---

# Explore AI information extraction scenarios

In this exercise you will explore applications that demonstrates how AI can be used to extract the information from content in multiple formats.

This exercise should take approximately **15** minutes to complete.

## Extract fields from receipts

Suppose an organization needs to automate expense claim processing. One requirement for such an application might be to locate and extract key information from scanned receipts, which may be in multiple styles and layouts.

1. In a web browser, open the [Receipt Analyzer](https://aka.ms/receipt-analyzer){:target="_blank"} app at `https://aka.ms/receipt-analyzer`.
1. Use the **Upload Receipt** button to open **receipt-1.png**. When the image opens, wait for the analysis to finish and review the information extracted from the receipt - which should include the vendor name, the transaction date, and the total amount.
1. Note that the app has extracted the field values and also their locations within the receipt; which are marked on the image.
1. Repeat the process to analyze receipts 2 and 3; noting that the right information is extracted, even though the receipts vary in layout, style, and formatting for numbers and dates.

## Extract information from phone calls

Now let's examine a different scenario. Suppose the owner of a small business supplying coffee vending machines and supplies needs to respond to voicemail messages left by customers. By using AI to extract information from calls, the key details can be quickly reviewed to help prioritize tasks.

1. In a web browser, open the [Voicemail Analyzer](https://aka.ms/voicemail){:target="_blank"} app at `https://aka.ms/voicemail`.
1. Select each message on the left in turn, and review the AI-extracted information for the message on the right. You can also play the message to hear it.

> **Note**: The applications used in this exercise are a *simulations* - there are no actual AI models or services behind them. However, they're based on real capabilities you can implement with [Azure AI Foundry](https://azure.microsoft.com/products/ai-foundry/){:target="_blank"}; and in particular, the [Azure AI Document Intelligence](https://azure.microsoft.com/products/ai-services/ai-document-intelligence/){:target="_blank"} and [Azure AI Content Understanding](https://azure.microsoft.com/products/ai-services/ai-content-understanding){:target="_blank"} services.
