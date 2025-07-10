import { FeatureHighlight } from './FeatureHighlight.presenter';
import { HomeBanner } from './HomeBanner.container';

export default function HomePage() {
  return (
    <div className="h-full bg-black">
      <HomeBanner />
      <FeatureHighlight />
    </div>
  );
}
