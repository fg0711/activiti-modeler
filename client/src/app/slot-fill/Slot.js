/**
 * Copyright Camunda Services GmbH and/or licensed to Camunda Services GmbH
 * under one or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information regarding copyright
 * ownership.
 *
 * Camunda licenses this file to you under the MIT; you may not use this file
 * except in compliance with the MIT License.
 */

import React, { PureComponent, Fragment } from 'react';

import SlotContext from './SlotContext';


/**
 * A slot to be filled via <Fill> elements.
 *
 * @example
 *
 * <!-- default slot, shows fills in registration order -->
 *
 * <Slot name="toolbar" />
 *
 * <!-- slot with custom grouping and separators -->
 *
 * <Slot
 *   name="toolbar"
 *   group={ (fills) => [ fills ] }
 *   separator={ () => <hr /> }
 * />
 *
 * <!-- slot holding the first registered fill only -->
 *
 * <Slot
 *   name="special-button"
 *   limit={ 1 }
 * />
 *
 */
export default class Slot extends PureComponent {

  render() {
    const {
      name,
      group,
      separator,
      limit
    } = this.props;

    const groupFn = group || singleGroup;
    const separatorFn = separator || nonSeparator;

    return (
      <SlotContext.Consumer>{
        ({ fills }) => {

          const filtered = fills.filter(fill => {
            return fill.props.name === name;
          });

          const cropped = limit ? filtered.slice(0, limit) : filtered;

          const grouped = groupFn(cropped);

          return createFills(grouped, fillFragment, separatorFn);
        }
      }</SlotContext.Consumer>
    );
  }

}

function fillFragment(fill) {
  return <Fragment key={ fill.id }>{fill.props.children}</Fragment>;
}

function nonSeparator(key) {
  return null;
}

/**
 * Return a single group of fills.
 *
 * @param  {Array<Component>} fills
 *
 * @return {Array<Array<Component>>} grouped fills
 */
function singleGroup(fills) {
  return [
    fills
  ];
}

function createFills(arrays, fillFn, separatorFn) {

  var result = [];

  arrays.forEach(function(array, idx) {

    if (idx !== 0) {
      const separator = separatorFn(`__separator_${idx}`);

      if (separator) {
        result.push(separator);
      }
    }

    array.forEach(function(fill) {
      result.push(fillFn(fill));
    });
  });

  return result;
}