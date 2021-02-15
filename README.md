# Neck Posture AI
My neck posture while coding is always bending causing neck pains. This web app will help me train couple minutes a day on my posture.

It uses [Lobe.ai](https://lobe.ai) to train 5 labels. Then exported the model to run on [TensorFlow.js](https://www.tensorflow.org/js), and finally created a web app to host the models and run the inference.

**Note:** Only two human subjects were used to train, Mediterranean male, and Asian female

## Demo

Here is a demo https://mohamedmansour.com/sandbox/neck-posture-ai/, the model is 100MB and the runtime is 1MB. I used my face to train 600 images, so it most probably might not work for you. 
