import { Page, Locator } from '@playwright/test';

const DATA_TITLE = 'Exclusive or'; // Title of the dataset used can be updated to test different datasets.

export class TensorPage {
    readonly page: Page;

    // Toolbar Locators
    readonly startStopButton: Locator;
    readonly epochLabel: Locator;
    readonly learningRateSelect: Locator;

    // Noise Slider
    readonly noiseSlider: Locator;

    // Neurons
    readonly neuronControls: Locator;

    // Test Loss value
    readonly testLossValue: Locator;

    constructor(page: Page) {
        this.page = page;

        this.startStopButton = page.getByTitle('Run/Pause');
        this.epochLabel = page.locator('#iter-number');
        this.learningRateSelect = page.getByRole('combobox', { name: 'Learning rate' });
        this.noiseSlider = page.getByRole('slider', { name: 'Noise', exact: false });
        this.neuronControls = page.locator('div.plus-minus-neurons');
        this.testLossValue = page.locator('#loss-test');
    }

    async goto() {
        await this.page.goto('https://playground.tensorflow.org');
    }

    async setLearningRate(value: string) {
        await this.learningRateSelect.selectOption(value);
    }

    async selectDataset() {
        await this.page.getByTitle(DATA_TITLE).click();
    }

    async verifySelectedDataset(): Promise<boolean> {
        const classAttr = await this.page.getByTitle(DATA_TITLE).locator('canvas').getAttribute('class');
        return (classAttr ?? '').includes('selected');
    }

    async setNoiseLevel(percent: number) {
        await this.noiseSlider.fill(String(percent));
    }


    async getTestLoss(): Promise<number> {
        return Number(await this.testLossValue.textContent());
    }
}
