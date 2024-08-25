import { Flex, FlexProps } from '@mantine/core';
import { forwardRef } from 'react';

// Generic column layout component
export const Column = forwardRef<HTMLDivElement, FlexProps>(({ flex, children, ...rest }, ref) => (
    <Flex direction="column" ref={ref} {...rest}>
        {children}
    </Flex>
));

Column.displayName = 'Column';
