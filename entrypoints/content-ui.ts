import { mountContentUi } from './content/mountUi';

// Built as a separate ES module; never included in the automatic content script.
export default defineUnlistedScript(() => mountContentUi);
