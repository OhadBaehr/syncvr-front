import { Flex, FlexProps } from '@mantine/core';
import { forwardRef } from 'react';

// Generic column layout component
export const Row = forwardRef<HTMLDivElement, FlexProps>(({ flex, children, ...rest }, ref) => (
    <Flex direction="row" ref={ref} {...rest}>
        {children}
    </Flex>
));

Row.displayName = 'Row';
