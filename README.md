# Neck Posture AI
My neck posture while coding is always bending causing neck pains. The reason why my neck is bending is because I have Strabismus in my eyes, where I lost depth perception, so my eyes don't work together. This web app will help me train couple minutes a day on my posture while doing various activies on the computer.

It uses [Lobe.ai](https://lobe.ai) to train 5 labels. Then exported the model to run on [TensorFlow.js](https://www.tensorflow.org/js), and finally created a web app to host the models and run the inference.

**Note:** Only my face was used to train, Mediterranean male. The models is roughly 100MB in size. That is one of the cons running local inferencing. Nothing gets stored in the cloud, this can run offline.

## Demo

Here is a demo https://mohamedmansour.com/sandbox/neck-posture-ai/, the model is 100MB and the runtime is 1MB. I used my face to train 600 images, so it most probably might not work for you. 

Statistics was added so I can keep track how well I am doing in every training session, and keep track of it over time. They don't get stored on the browser, yet. Everything is lost on browser refresh.