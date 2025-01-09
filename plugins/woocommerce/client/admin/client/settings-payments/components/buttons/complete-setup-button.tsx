/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import {
	PaymentProviderState,
	PaymentProviderOnboardingState,
} from '@woocommerce/data';
import { getHistory, getNewPath } from '@woocommerce/navigation';

/**
 * Internal dependencies
 */

interface CompleteSetupButtonProps {
	/**
	 * The ID of the gateway to activate payments for.
	 */
	gatewayId: string;
	/**
	 * The state of the gateway.
	 */
	gatewayState: PaymentProviderState;
	/**
	 * The onboarding state for this gateway.
	 */
	onboardingState: PaymentProviderOnboardingState;
	/**
	 * The settings URL to navigate to, if we don't have an onboarding URL.
	 */
	settingsHref: string;
	/**
	 * The onboarding URL to navigate to when the gateway needs setup.
	 */
	onboardingHref: string;
	/**
	 * Whether the gateway has a list of recommended payment methods to use during the native onboarding flow.
	 */
	gatewayHasRecommendedPaymentMethods: boolean;
	/**
	 * The text of the button.
	 */
	buttonText?: string;
}

export const CompleteSetupButton = ( {
	gatewayId,
	gatewayState,
	onboardingState,
	settingsHref,
	onboardingHref,
	gatewayHasRecommendedPaymentMethods,
	buttonText = __( 'Complete setup', 'woocommerce' ),
}: CompleteSetupButtonProps ) => {
	const [ isUpdating, setIsUpdating ] = useState( false );

	const accountConnected = gatewayState.account_connected;
	const onboardingStarted = onboardingState.started;
	const onboardingCompleted = onboardingState.completed;

	const completeSetup = () => {
		setIsUpdating( true );

		if ( ! accountConnected || ! onboardingStarted ) {
			if ( gatewayHasRecommendedPaymentMethods ) {
				const history = getHistory();
				history.push( getNewPath( {}, '/payment-methods' ) );
			} else {
				// Redirect to the gateway's onboarding URL if it needs setup.
				window.location.href = onboardingHref;
				return;
			}
		} else if (
			accountConnected &&
			onboardingStarted &&
			! onboardingCompleted
		) {
			// Redirect to the gateway's onboarding URL if it needs setup.
			window.location.href = onboardingHref;
			return;
		} else {
			// Redirect to the gateway's settings URL if the account is already connected.
			window.location.href = settingsHref;
			return;
		}

		setIsUpdating( false );
	};

	return (
		<Button
			key={ gatewayId }
			variant={ 'primary' }
			isBusy={ isUpdating }
			disabled={ isUpdating }
			onClick={ completeSetup }
		>
			{ buttonText }
		</Button>
	);
};
