/**
 * External dependencies
 */
import { createElement } from '@wordpress/element';
import classnames from 'classnames';
import {
	__experimentalHeading as Heading,
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
} from '@wordpress/components';

export const Header = ( {
	pageTitle = '',
	hasTabs = false,
}: {
	pageTitle?: string;
	hasTabs?: boolean;
} ) => {
	return (
		<VStack
			className={ classnames(
				'woocommerce-settings-header edit-site-page-header',
				{
					'woocommerce-settings-header--has-tabs': hasTabs,
				}
			) }
			as="header"
			spacing={ 0 }
		>
			<HStack className="edit-site-page-header__page-title">
				<Heading
					as="h2"
					level={ 3 }
					weight={ 500 }
					className="edit-site-page-header__title"
					truncate
				>
					{ pageTitle }
				</Heading>
			</HStack>
		</VStack>
	);
};
